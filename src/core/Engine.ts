/*******************************************************************************
 * Copyright 2015 See AUTHORS file.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/

import { Entity } from "./Entity";
import { EntitySystem } from "./EntitySystem";
import { UniqueType } from "./UniqueType";
import { Family } from "./Family";
import { EntityFactory } from "../utils/EntityFactory";
import { Signal } from "typed-signals";
import { Constructor } from "../utils/Constructor";
import { Lookup } from "../utils/Lookup";
import { DelayedOperationHandler } from "../utils/DelayedOperationHandler";
import { Bits } from "../utils/Bits";


function compareSystems(a: EntitySystem, b: EntitySystem) {
	return a.getPriority() - b.getPriority();
}

interface FriendlySystem {
	addedToEngine(engine: Engine): void;
	removedFromEngine(engine: Engine): void;
}

interface FriendlyEntity {
	uuid: number;
	scheduledForRemoval: boolean;
	readonly familyBits: Bits;
	engine: Engine | null;
}

/**
 *  A simple entity signal.
 */
export class EntitySignal extends Signal<(entity: Entity) => void> { }

/**
 * The heart of the Entity framework. It is responsible for keeping track of Entity and
 * managing EntitySystem objects. The Engine should be updated every tick via the update(float) method.
 *
 * With the Engine you can:
 *
 * - Create entities using createEntity()
 * - Add/Remove Entity objects
 * - Add/Remove {@link EntitySystem}s
 * - Obtain a list of entities for a specific Family
 * - Update the main loop
 * - Connect to/Disconnect from EntitySignal
 */
export class Engine {
	private entities: Entity[] = [];
	private entitiesById: { [s: number]: Entity } = {};
	private systems: EntitySystem[] = [];
	private systemsByType: { [s: string]: EntitySystem } = {};
	private entitiesByFamily: { [s: string]: Entity[] } = {};
	private entityAddedSignals: { [s: string]: EntitySignal } = {};
	private entityRemovedSignals: { [s: string]: EntitySignal } = {};
	private entityFactory: EntityFactory;
	private updating = false;
	private notifying = false;
	private nextEntityId = 1;
	private entityFamilyUpdates: Entity[] = [];

	// Mechanism to delay component addition/removal to avoid affecting system processing
	private entityOperationHandler: DelayedOperationHandler<Entity>;
	// private systemOperationHandler: DelayedOperationHandler<EntitySystem>;

	/** Will dispatch an event when an entity is added. */
	public readonly entityAdded = new EntitySignal();
	/** Will dispatch an event when an entity is removed. */
	public readonly entityRemoved = new EntitySignal();
	/** Store and look up instances of classes. */
	public readonly lookup = new Lookup();

	/**
	 * Creates a new Engine.
	 */
	public constructor() {
		this.entityOperationHandler = new DelayedOperationHandler<Entity>({
			onAdd: this.addEntityInternal.bind(this),
			onRemove: this.removeEntityInternal.bind(this),
			onRemoveAll: this.removeAllEntitiesInternal.bind(this)
		});
		// this.systemOperationHandler = new DelayedOperationHandler<EntitySystem>({
		// 	onAdd: this.addSystemInternal.bind(this),
		// 	onRemove: this.removeSystemInternal.bind(this),
		// 	onRemoveAll: this.removeAllSystemsInternal.bind(this)
		// });
	}

	/**
	 * @return true if this engine is currently updating systems.
	 */
	public isUpdating(): boolean {
		return this.updating;
	}

	/**
	 * Remove all entities and systems.
	 */
	public destroy() {
		do {
			this.removeAllEntities();
			this.processEntityFamilyUpdates();
			this.entityOperationHandler.process();
		} while (this.entities.length);

		this.removeAllSystems();
	}

	/** @return A new Entity. In order to add it to the Engine, use addEntity(Entity). */
	public createEntity(): Entity {
		return new Entity();
	}

	/**
	 * Creates and assembles an Entity using the EntityFactory.
	 * In order to add it to the Engine, use addEntity().
	 * setEntityFactory must be called before first use.
	 *
	 * @param blueprintname The name of the entity blueprint
	 * @return A fully assembled Entity or null if the assembly failed.
	 */
	public assembleEntity(blueprintname: string, overrides?: { [s: string]: { [s: string]: any } }): Entity | null {
		if (this.entityFactory) {
			let entity = this.createEntity();
			if (this.entityFactory.assemble(entity, blueprintname, overrides)) {
				return entity;
			}
			entity.removeAll();
		}
		return null;
	}

	/**
	 * Set the EntityFactory to use with assembleEntity.
	 *
	 * @param entityFactory The new EntityFactory
	 */
	public setEntityFactory(entityFactory: EntityFactory): void {
		this.entityFactory = entityFactory;
	}

	/**
	 * Adds an entity to this Engine.
	 *
	 * @param entity the entity to add
	 */
	public addEntity(entity: Entity): void {
		if (((entity as any) as FriendlyEntity).uuid != 0) throw "Entity already added to an engine";
		((entity as any) as FriendlyEntity).uuid = this.obtainEntityId();
		((entity as any) as FriendlyEntity).engine = this;
		if (this.updating || this.notifying)
			this.entityOperationHandler.add(entity);
		else
			this.addEntityInternal(entity);
	}

	/**
	 * Removes an entity from this Engine.
	 *
	 * @param entity the entity to remove
	 */
	public removeEntity(entity: Entity): void {
		if (this.updating || this.notifying) {
			if (((entity as any) as FriendlyEntity).scheduledForRemoval)
				return;

			((entity as any) as FriendlyEntity).scheduledForRemoval = true;
			this.entityOperationHandler.remove(entity);
		} else {
			((entity as any) as FriendlyEntity).scheduledForRemoval = true;
			this.removeEntityInternal(entity);
		}
	}

	/**
	 * Removes all entities registered with this Engine.
	 */
	public removeAllEntities(): void {
		if (this.updating || this.notifying) {
			for (let entity of this.entities)
				((entity as any) as FriendlyEntity).scheduledForRemoval = true;

			this.entityOperationHandler.removeAll();
		}
		else {
			while (this.entities.length) {
				this.removeEntity(this.entities[0]);
			}
		}
	}

	/**
	 * @param id The id of an Entity
	 * @return The entity associated with the specified id or null if no such entity exists.
	 */
	public getEntity(id: number): Entity | null {
		return this.entitiesById[id] || null;
	}

	/** @return A list of all entities */
	public getEntities(): Entity[] {
		return this.entities;
	}

	/**
	 * Adds the EntitySystem to this Engine.
	 *
	 * @typeparam T The entity system class
	 * @param system The EntitySystem to add
	 */
	public addSystem<T extends EntitySystem>(system: T): T {
		let systemType = UniqueType.getForInstance(system);
		let systemTypeIndex = systemType.getIndex();

		this.removeSystemInternal(systemType);

		this.systems.push(system);
		this.systemsByType[systemTypeIndex] = system;
		((system as any) as FriendlySystem).addedToEngine(this);

		this.sortSystems();
		return system;
	}

	/**
	 * Removes the EntitySystem from this Engine.
	 *
	 * @param clazz The System class to remove
	 */
	public removeSystem(clazz: Constructor<EntitySystem>): void {
		this.removeSystemInternal(UniqueType.getForClass(clazz));
	}

	/**
	 * Removes all systems registered with this Engine.
	 */
	public removeAllSystems(): void {
		for (let system of this.systems) {
			((system as any) as FriendlySystem).removedFromEngine(this);
		}
		this.systems = [];
		this.systemsByType = {};
	}

	/**
	 * Sort all systems (usually done letmatically, except if you override EntitySystem.getPriority())
	 */
	public sortSystems(): void {
		this.systems.sort(compareSystems);
	}

	/**
	 * Removes the EntitySystem from this Engine.
	 *
	 * @param type The EntitySystem type to remove
	 */
	private removeSystemInternal(type: UniqueType): void {
		let index = type.getIndex();
		let system = this.systemsByType[index];
		if (system) {
			delete this.systemsByType[index];

			let index2 = this.systems.indexOf(system);
			/* istanbul ignore else: this will never happen */
			if (index2 !== -1)
				this.systems.splice(index2, 1);
			((system as any) as FriendlySystem).removedFromEngine(this);
		}
	}

	/**
	 * Quick EntitySystem retrieval.
	 *
	 * @typeparam T The entity system class
	 * @param clazz The EntitySystem class
	 * @return The EntitySystem of the specified class, or null if no such system exists.
	 */
	public getSystem<T extends EntitySystem>(clazz: Constructor<T>): T | null {
		let type = UniqueType.getForClass(clazz);
		let index = type.getIndex();
		return <T>this.systemsByType[index] || null;
	}

	/**
	 * @return A list of all entity systems managed by the Engine.
	 */
	public getSystems(): EntitySystem[] {
		return this.systems;
	}

	/**
	 * @param family A Family instance
	 * @return A list of entities for the specified Family. Will return the same instance every time.
	 */
	public getEntitiesFor(family: Family): Entity[] {
		return this.registerFamily(family);
	}

	/**
	 * @param family A Family instance
	 * @return The EntitySignal which emits when an entity is added to the specified Family
	 */
	public getEntityAddedSignal(family: Family): EntitySignal {
		this.registerFamily(family);
		let index = family.uniqueType.getIndex();
		let signal = this.entityAddedSignals[index];
		if (!signal)
			signal = this.entityAddedSignals[index] = new EntitySignal();
		return signal;
	}

	/**
	 * @param family A Family instance
	 * @return The EntitySignal which emits when an entity is removed from the specified Family
	 */
	public getEntityRemovedSignal(family: Family): EntitySignal {
		this.registerFamily(family);
		let index = family.uniqueType.getIndex();
		let signal = this.entityRemovedSignals[index];
		if (!signal)
			signal = this.entityRemovedSignals[index] = new EntitySignal();
		return signal;
	}

	/**
	 * Updates all the systems in this Engine.
	 *
	 * @param deltaTime The time passed since the last frame.
	 */
	public update(deltaTime: number): void {
		this.updating = true;
		for (let system of this.systems) {
			if (system.checkProcessing())
				system.update(deltaTime);

			this.processEntityFamilyUpdates();
			this.entityOperationHandler.process();
		}

		this.updating = false;
	}

	private obtainEntityId(): number {
		return this.nextEntityId++;
	}

	/**
	 * Request the update of an entities family bits. For internal use.
	 * 
	 * @param entity The entity to update
	 */
	public requestFamilyUpdate(entity: Entity) {
		if (this.updating || this.notifying)
			this.entityFamilyUpdates.push(entity);
		else
			this.updateFamilyMembership(entity);
	}

	private processEntityFamilyUpdates() {
		let entity;
		while (entity = this.entityFamilyUpdates.pop()) {
			this.updateFamilyMembership(entity);
		}
	}

	private updateFamilyMembership(entity: Entity): void {
		if (((entity as any) as FriendlyEntity).scheduledForRemoval || !entity.isValid())
			return;
		for (let key in this.entitiesByFamily) {
			let family = Family.getByIndex(parseInt(key));
			/* istanbul ignore if: this will never happen */
			if (!family)
				continue;
			let familyEntities = this.entitiesByFamily[key];
			let familyIndex = family.uniqueType.getIndex();

			let belongsToFamily = entity.getFamilyBits().get(familyIndex);
			let matches = family.matches(entity);

			if (!belongsToFamily && matches) {
				familyEntities.push(entity);
				((entity as any) as FriendlyEntity).familyBits.set(familyIndex);

				this.notifyFamilyListenersAdd(family, entity);
			}
			else if (belongsToFamily && !matches) {
				let index = familyEntities.indexOf(entity);
				/* istanbul ignore else: this will never happen */
				if (index !== -1)
					familyEntities.splice(index, 1);
				((entity as any) as FriendlyEntity).familyBits.clear(familyIndex);

				this.notifyFamilyListenersRemove(family, entity);
			}
		}
	}

	private removeEntityInternal(entity: Entity): void {
		// Check if entity is able to be removed (id == 0 means the entity has not been added to the engine yet)
		if (entity.getId() == 0) {
			entity.removeAll();
			return;
		}

		let index = this.entities.indexOf(entity);
		if (index === -1)
			throw "Entity does not belong to this engine";
		this.entities.splice(index, 1);
		delete this.entitiesById[entity.getId()];

		if (!entity.getFamilyBits().isEmpty()) {
			for (let key in this.entitiesByFamily) {
				let family = Family.getByIndex(parseInt(key));
				/* istanbul ignore if: this will never happen */
				if (!family)
					continue;
				let familyEntities = this.entitiesByFamily[key];

				if (family.matches(entity)) {
					let index2 = familyEntities.indexOf(entity);
					/* istanbul ignore else: this will never happen */
					if (index2 !== -1)
						familyEntities.splice(index2, 1);

					((entity as any) as FriendlyEntity).familyBits.clear(family.uniqueType.getIndex());
					this.notifyFamilyListenersRemove(family, entity);
				}
			}
		}

		this.notifying = true;
		this.entityRemoved.emit(entity);
		this.notifying = false;

		entity.removeAll();
		((entity as any) as FriendlyEntity).engine = this;
	}

	private removeAllEntitiesInternal(): void {
		let entities = this.getEntities();
		while (entities.length) {
			this.removeEntityInternal(entities[entities.length - 1]);
		}
	}

	private addEntityInternal(entity: Entity): void {
		this.entities.push(entity);
		this.entitiesById[entity.getId()] = entity;

		this.updateFamilyMembership(entity);

		this.notifying = true;
		this.entityAdded.emit(entity);
		this.notifying = false;
	}

	private notifyFamilyListenersAdd(family: Family, entity: Entity): void {
		let signal = this.entityAddedSignals[family.uniqueType.getIndex()];
		if (signal) {
			this.notifying = true;
			signal.emit(entity);
			this.notifying = false;
		}
	}

	private notifyFamilyListenersRemove(family: Family, entity: Entity): void {
		let signal = this.entityRemovedSignals[family.uniqueType.getIndex()];
		if (signal) {
			this.notifying = true;
			signal.emit(entity);
			this.notifying = false;
		}
	}

	private registerFamily(family: Family): Entity[] {
		let familyIndex = family.uniqueType.getIndex();
		let entities = this.entitiesByFamily[familyIndex];
		if (entities)
			return entities;

		let familyEntities = this.entitiesByFamily[familyIndex];
		if (!familyEntities)
			familyEntities = this.entitiesByFamily[familyIndex] = [];
		for (let e of this.entities) {
			if (family.matches(e)) {
				familyEntities.push(e);
				((e as any) as FriendlyEntity).familyBits.set(familyIndex);
			}
		}
		return familyEntities;
	}
}


