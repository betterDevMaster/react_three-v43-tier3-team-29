import React, { useState, Suspense, useEffect, useRef } from 'react';
import { AudioLoader } from 'three';
import { PositionalAudio, useScroll } from '@react-three/drei';
import { useLoader, useFrame } from '@react-three/fiber';
import { WorkStation } from './components/WorkStation/WorkStation';
import { CustomText3D } from './components/CustomText3D/CustomText3D';
import Island from './components/Island/Island';
import Campfire from './components/Campfire/Campfire';
import Animal from './components/Animal/Animal';
import Characters from './components/Characters/Characters';
import Background from './components/Background/Background';
import Lights from './components/Lights/Lights';
import RandomClouds from './components/RandomClouds/RandomClouds';
import Board from './components/Board/Board';
import { val } from '@theatre/core';
import { cameraMovementSheet } from './animation/theatre';
import { editable as e, PerspectiveCamera } from '@theatre/r3f';

export function Experience() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    // without this, the PositionalAudio causes an error
    setTimeout(() => setReady(true), 2000);
  }, []);

  const islandRef = useRef();
  const prevRange = useRef(0);
  const scroll = useScroll();

  useFrame(() => {
    // this enables control of sequence with scrolling
    const currentScrollRange = scroll.range(0, 1);
    // not scrolling
    if (prevRange.current == currentScrollRange) return;
    cameraMovementSheet.sequence.position =
      val(cameraMovementSheet.sequence.pointer.length) * currentScrollRange;
  });

  return (
    <Suspense fallback={null}>
      <hemisphereLight
        skyColor='#ffffff'
        groundColor='#919191'
        intensity={0.15}
      />

      <PerspectiveCamera
        theatreKey='Camera'
        makeDefault
        position={[-5, 18, -50]}
        fov={35}
        lookAt={islandRef}
      />

      <e.group theatreKey='CameraTarget' ref={islandRef} position={[0, 0, 5]} />

      <CustomText3D text='Portfolio' />

      <group position={[0, 0, 0]}>
        <RandomClouds amount={5} />
        {ready && (
          <PositionalAudio autoplay loop url='audio/Wind.mp3' distance={1} />
        )}
      </group>

      <group position={[0, -11.9, 0]}>
        <Island />

        {ready && (
          <PositionalAudio
            autoplay
            loop
            url='audio/Crickets.mp3'
            distance={3}
          />
        )}
      </group>

      <group position={[-8, -1, 5]}>
        <Campfire />
        {ready && (
          <PositionalAudio autoplay loop url='audio/Fire.mp3' distance={0.7} />
        )}
      </group>

      <WorkStation />
      <Animal />
      <Characters />
      <Lights />
      <Background />
      <Board />
      <Frog />
    </Suspense>
  );
}

// without this PositionalAudio generates an error
// need to understand why this is necessary, and it's not in the example https://codesandbox.io/s/gkfhr?file=/src/App.js
useLoader.preload(AudioLoader, 'audio/Fire.mp3');
useLoader.preload(AudioLoader, 'audio/Crickets.mp3');
useLoader.preload(AudioLoader, 'audio/Wind.mp3');
