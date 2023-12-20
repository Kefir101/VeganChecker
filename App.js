import * as React from "react";
import { OCR, parse } from "./helperFunctions";
import { StyleSheet, Text, View, Button, TouchableOpacity, Image, Dimensions, useWindowDimensions, Linking } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { Camera } from 'expo-camera';
import Svg, { Line } from 'react-native-svg';
// import store from 'react-native-simple-store';
// import Storage from 'react-native-storage';
// import AsyncStorage from '@react-native-async-storage/async-storage'

export default function App() {
  let { height, width } = useWindowDimensions();
  let screenHeight = height;
  let screenWidth = width;


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
  // if(!store.keys().includes('showRateButton')){
  //   store.update('showRateButton', {display: true})
  // }
  // const [showRateButton, setShowRateButton] = useState(store.get('showRateButton'))
  const [showRateButton, setShowRateButton] = useState(true)


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

  const openAppStore = () => {
    const link = 'itms-apps://apps.apple.com/tr/app/veganchecker/id1672693217?l=tr';
    Linking.canOpenURL(link).then(
      (supported) => {
        supported && Linking.openURL(link);
      },
      (err) => console.log(err)
    );
    setShowRateButton(false) 
    // store.update('showRateButton', {display: false})
  };

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
    setVeganResult("Analyzing text...");
    const score_ADI_BoxOutline = await parse(OCRoutput[0].text, showMaybeNonVegan, true, OCRoutput[1], screenHeight, screenWidth);
    if (score_ADI_BoxOutline[0] == "error") {
      setVeganResult("" + score_ADI_BoxOutline[1]);
      setTextColor("red");
    } else {
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
    }
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
        <Svg height={screenHeight} width={screenWidth} style={styles.overlay} preserveAspectRatio="xMidYMin slice">
          {boxVertices.map((box, index) => (
            [<Line key={"line1" + index} x1={screenWidth - box[0][0][0]} y1={box[0][0][1]} x2={screenWidth - box[0][1][0]} y2={box[0][1][1]} stroke={box[1]} strokeWidth="2" />
              , <Line key={"line2" + index} x1={screenWidth - box[0][1][0]} y1={box[0][1][1]} x2={screenWidth - box[0][2][0]} y2={box[0][2][1]} stroke={box[1]} strokeWidth="2" />
              , <Line key={"line3" + index} x1={screenWidth - box[0][2][0]} y1={box[0][2][1]} x2={screenWidth - box[0][3][0]} y2={box[0][3][1]} stroke={box[1]} strokeWidth="2" />
              , <Line key={"line4" + index} x1={screenWidth - box[0][3][0]} y1={box[0][3][1]} x2={screenWidth - box[0][0][0]} y2={box[0][0][1]} stroke={box[1]} strokeWidth="2" />
            ]
          ))}
        </Svg>
        <Image style={styles.image} source={require('./assets/icon_transparent.png')} />
        <TouchableOpacity style={styles.maybeButton} onPress={toggleSwitch}>
          <Text allowFontScaling={false} style={styles.maybeButtonText}>{showMaybeNonVegan ? 'press to ignore \nmaybe non-vegan' : 'press to show \nmaybe non-vegan'}</Text>
        </TouchableOpacity>
        {showRateButton && <TouchableOpacity style={styles.rateButton} onPress={openAppStore}>
          <Text allowFontScaling={false} style={styles.rateButtonText}>Rate my app!</Text>
        </TouchableOpacity>}

        <TouchableOpacity style={styles.veganTextContainer} onPress={removeText}>
          <Text allowFontScaling={false} style={{ borderRadius: 8, overflow: 'hidden', padding: 3, textAlign: 'center', top: 0, fontSize: 24, fontWeight: 'bold', color: textColor, backgroundColor: veganTextBGC }}>{veganResult}</Text>
          <Text allowFontScaling={false} style={{ borderRadius: 5, overflow: 'hidden', padding: 4, flex: 1, textAlign: 'center', top: 0, fontSize: 14, fontWeight: 'bold', color: textColor, backgroundColor: foundADIBGC }}>{foundADI}</Text>
        </TouchableOpacity>
        <View style={styles.buttonContainer}>
          <Button allowFontScaling={false} color='green' title="Take Pic" onPress={takePic} />
        </View>
        <StatusBar style="auto" />
      </Camera>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute'
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  image: {
    position: 'absolute',
    top: 26,
    marginRight: 'auto',
    left: 12,
    width: 58,
    height: 58,
  },
  buttonContainer: {
    position: 'absolute',
    backgroundColor: 'white',
    width: 100,
    borderRadius: 100,
    bottom: 10,
  },
  veganTextContainer: {
    alignSelf: 'center',
    position: 'absolute',
    top: 126,
    borderRadius: 10,
    padding: 4,
  },
  maybeButton: {
    position: 'absolute',
    justifyContent: 'center',
    backgroundColor: '#fff',
    width: 110,
    height: 40,
    borderRadius: 200,
    top: 37,
    right: 10,
  },
  maybeButtonText: {
    color: 'black',
    textAlign: 'center',
    fontSize: 10.5,
  },
  rateButton: {
    position: 'absolute',
    justifyContent: 'center',
    backgroundColor: '#fff',
    width: 70,
    height: 35,
    borderRadius: 100,
    top: 81,
    left: 10,
  },
  rateButtonText: {
    color: 'green',
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold'
  },
});