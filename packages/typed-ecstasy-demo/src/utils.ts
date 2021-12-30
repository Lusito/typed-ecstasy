export async function loadAudioBuffer(audioContext: AudioContext, path: string) {
    const response = await fetch(path);
    const data = await response.arrayBuffer();
    return audioContext.decodeAudioData(data);
}
