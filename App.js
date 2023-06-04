import * as React from "react";
import {OCR, parse} from "./helperFunctions";
import {StyleSheet, Text, View, Button, TouchableOpacity, Image} from 'react-native';
import {StatusBar} from 'expo-status-bar';
import {useEffect, useRef, useState } from 'react';
import { Camera } from 'expo-camera';

export default function App() {
  let cameraRef = useRef();
  let score = -1;
  let colors = ["white", "red", "#ffd700", "green"];

  const [textColor, setTextColor] = useState("white");
  const [veganResult, setVeganResult] = useState("");
  const [foundADI, setFoundADI] = useState("");
  const [showMaybeNonVegan, setShowMaybeNonVegan] = useState(false);
  const [veganTextBGC, setVeganTextBGC] = useState("")
  const [foundADIBGC, setFoundADIBGC] = useState("")
  const toggleSwitch = () => setShowMaybeNonVegan(previousState => !previousState);

  const [hasCameraPermission, setHasCameraPermission] = useState();
  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraPermission.status === "granted");
    })();
  }, []);

  if (hasCameraPermission === undefined) {
    return <Text>Requesting permissions...</Text>
  } else if (!hasCameraPermission) {
    return <Text>Permission for camera not granted. Please change this in settings.</Text>
  }
  let takePic = async () => {
    let options = {
      quality: 0.4,
      base64: true,
      exif: false
    };

    let newPhoto = await cameraRef.current.takePictureAsync(options);
    setTextColor(colors[score+1])
    setFoundADI(undefined);
    setVeganTextBGC("black");
    setFoundADIBGC(undefined);
    setVeganResult("Scanning image...");
    const textRead = (await OCR(newPhoto.base64)).text;
    setVeganResult("Analyzing text...");
    const scoreAndFoundADI = await parse(textRead, showMaybeNonVegan);
    score = scoreAndFoundADI[0];
    if (score == 2){
      setVeganResult("Appears to be vegan.");
    } else if(score == 1){
      setVeganResult("Maybe not be vegan because of:");
    } else if(score == 0){
      setVeganResult("NOT vegan.");
    } else if(score == -1){
      setVeganResult("No words found. Please scan again.");
    }
    if(scoreAndFoundADI[1]){
      setFoundADI(scoreAndFoundADI[1]);
      setFoundADIBGC("black");
    }
    setTextColor(colors[score+1])
  }; 
  const removeText = () => {
    if(veganResult != "Scanning image..." && veganResult != "Analyzing text..."){
      setTextColor(colors[score+1])
      setFoundADI(undefined);
      setVeganTextBGC(undefined);
      setFoundADIBGC(undefined);
      setVeganResult(undefined);
    }
  }
  return (
    <>
      <Camera style={styles.container} ref={cameraRef}>
        <Image style={styles.image} source={require('./assets/icon_transparent.png')}/>
        <TouchableOpacity style={styles.maybeButton} onPress={toggleSwitch}>
          <Text style={styles.buttonText}>{showMaybeNonVegan ? 'press to ignore \nmaybe non-vegan' : 'press to show \nmaybe non-vegan'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{position: 'absolute', top: 120}} onPress={removeText}>
          <Text style={{borderRadius: 8, overflow: 'hidden', padding: 3, textAlign: 'center', top: 0, fontSize: 24, fontWeight: 'bold', color: textColor, backgroundColor: veganTextBGC}}>{veganResult}</Text>
          <Text style={{borderRadius: 5, overflow: 'hidden', padding: 4, flex: 1, textAlign: 'center', top: 0, fontSize: 14, fontWeight: 'bold', color: textColor, backgroundColor: foundADIBGC}}>{foundADI}</Text>
        </TouchableOpacity>
        <View style={styles.buttonContainer}>
          <Button color='green' title="Take Pic" onPress={takePic}/>
        </View>
        <StatusBar style="auto"/>
      </Camera>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  image: {
    position: 'absolute',
    top: 15,
    marginRight: 'auto',
    left: 12,
    width: 52,
    height: 52,
  },
  buttonContainer: {
    backgroundColor: '#fff',
    width: 100,
    borderRadius: 100
  },
  veganTextContainer: {
    alignSelf: 'center',
    position: 'absolute',
    top: 120,
    borderRadius: 10,
    padding: 4,
  },
  buttonText: {
    color: 'black',
    left: 14,
    top: 7,
    fontSize: 10 ,
  },
  maybeButton: {
    position: 'absolute',
    backgroundColor: '#fff',
    width: 110,
    height: 40,
    borderRadius: 200,
    top: 30,
    right: 10,
  }
});