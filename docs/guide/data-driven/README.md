# Overview

Manually creating entities and components is tedious. Usually you want your entities to be created from your data.
For a data-driven approach, you can use an EntityFactory. This way you can define blueprints for entities and load data from your levels automatically.

This guide shows one approach of doing this. The code should be flexible enough to allow you to adjust it to your project.
If not, feel free to take a look at the source-code on GitHub and either create a ticket or create your own implementation.

Follow these steps to get a data-driven approach:

1. [Create components and respective factories to initialize said components](components.md)
2. [Adding some extra types](types.md) (EntityConfig and Context)
3. [Define blueprints](blueprints.md) (for example in .json format)
4. [Set up an EntityFactory](entityfactory.md)
5. [Use the EntityFactory to create new entities](usage.md)

## About the Folder Structure

The folder structure shown in this guide is just an example and you should adapt it as you see fit.
You can find the source-code of this guide in the GitHub repository.
