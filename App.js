import * as React from "react";
import { OCR, parse } from "./helperFunctions";
import { StyleSheet, Text, View, Button, TouchableOpacity, Image, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { Camera } from 'expo-camera';
import Svg, { Line } from 'react-native-svg';
export default function App() {
  const screenDimensions = Dimensions.get('window');
  const screenHeight = screenDimensions.height;
  const screenWidth = screenDimensions.width;

  let cameraRef = useRef();
  let score = -1;
  let colors = ["white", "red", "#ffd700", "green"];

  const [textColor, setTextColor] = useState("white");
  const [veganResult, setVeganResult] = useState("");
  const [foundADI, setFoundADI] = useState("");
  const [showMaybeNonVegan, setShowMaybeNonVegan] = useState(false);
  const [veganTextBGC, setVeganTextBGC] = useState("")
  const [foundADIBGC, setFoundADIBGC] = useState("")
  const [boxVertices, setBoxVertices] = useState([])
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
    setTextColor(colors[score + 1])
    setFoundADI(undefined);
    setVeganTextBGC("black");
    setFoundADIBGC(undefined);
    setBoxVertices([]);
    setVeganResult("Scanning image...");
    const OCRoutput = await OCR(newPhoto.base64);
    const textRead = OCRoutput[0].text;
    const wordAndBox = OCRoutput[1];
    setVeganResult("Analyzing text...");
    const score_ADI_BoxOutline = await parse(textRead, showMaybeNonVegan, wordAndBox, screenHeight, screenWidth);
    score = score_ADI_BoxOutline[0];
    if (score == 2) {
      setVeganResult("Appears to be vegan.");
    } else if (score == 1) {
      setVeganResult("Maybe not be vegan because of:");
    } else if (score == 0) {
      setVeganResult("NOT vegan.");
    } else if (score == -1) {
      setVeganResult("No words found. Please scan again.");
    }
    if (score_ADI_BoxOutline[1]) {
      setFoundADI(score_ADI_BoxOutline[1]);
      setFoundADIBGC("black");
    }
    if (score_ADI_BoxOutline[2]) {
      setBoxVertices(score_ADI_BoxOutline[2])
    }
    setTextColor(colors[score + 1])
  };
  const removeText = () => {
    if (veganResult != "Scanning image..." && veganResult != "Analyzing text...") {
      setTextColor(colors[score + 1])
      setFoundADI(undefined);
      setVeganTextBGC(undefined);
      setFoundADIBGC(undefined);
      setVeganResult(undefined);
      setBoxVertices([]);
    }
  }
  return (
    <>
      <Camera style={styles.container} ref={cameraRef}>
        <Svg height={screenHeight} width={screenWidth} style={styles.overlay}>
        {/* <Rect key={index} x={screenWidth - box[0][3][0]} y={box[0][3][1]} width={box[0][2][0] - box[0][0][0]} height={box[0][1][1]-box[0][1]} stroke="red" strokeWidth="2" fill="none"/> */}
          {boxVertices.map((box, index) => (
            <Line key={"line1"+index} x1={screenWidth - box[0][0][0]} y1={box[0][0][1]} x2={screenWidth - box[0][1][0]} y2={box[0][1][1]} stroke={box[1]} strokeWidth="2" />
          ))}
          {boxVertices.map((box, index) => (
            <Line key={"line2"+index} x1={screenWidth - box[0][1][0]} y1={box[0][1][1]} x2={screenWidth - box[0][2][0]} y2={box[0][2][1]} stroke={box[1]} strokeWidth="2" />
          ))}
          {boxVertices.map((box, index) => (
            <Line key={"line3"+index} x1={screenWidth - box[0][2][0]} y1={box[0][2][1]} x2={screenWidth - box[0][3][0]} y2={box[0][3][1]} stroke={box[1]} strokeWidth="2" />
          ))}
          {boxVertices.map((box, index) => (
            <Line key={"line4"+index} x1={screenWidth - box[0][3][0]} y1={box[0][3][1]} x2={screenWidth - box[0][0][0]} y2={box[0][0][1]} stroke={box[1]} strokeWidth="2" />
          ))}
        </Svg>
        <Image style={styles.image} source={require('./assets/icon_transparent.png')} />
        <TouchableOpacity style={styles.maybeButton} onPress={toggleSwitch}>
          <Text style={styles.buttonText}>{showMaybeNonVegan ? 'press to ignore \nmaybe non-vegan' : 'press to show \nmaybe non-vegan'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ position: 'absolute', top: 120 }} onPress={removeText}>
          <Text style={{ borderRadius: 8, overflow: 'hidden', padding: 3, textAlign: 'center', top: 0, fontSize: 24, fontWeight: 'bold', color: textColor, backgroundColor: veganTextBGC }}>{veganResult}</Text>
          <Text style={{ borderRadius: 5, overflow: 'hidden', padding: 4, flex: 1, textAlign: 'center', top: 0, fontSize: 14, fontWeight: 'bold', color: textColor, backgroundColor: foundADIBGC }}>{foundADI}</Text>
        </TouchableOpacity>
        <View style={styles.buttonContainer}>
          <Button color='green' title="Take Pic" onPress={takePic} />
        </View>
        <StatusBar style="auto" />
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
    borderRadius: 100,
    bottom: 11
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
    fontSize: 10,
  },
  maybeButton: {
    position: 'absolute',
    backgroundColor: '#fff',
    width: 110,
    height: 40,
    borderRadius: 200,
    top: 30,
    right: 10,
  },
  overlay: {
    position: 'absolute'
  }
});