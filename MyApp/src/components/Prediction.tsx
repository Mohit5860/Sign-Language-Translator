import {Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import Video from 'react-native-video';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {StackParamList} from '../App';
import Tts from 'react-native-tts';

type PredictionProps = NativeStackScreenProps<StackParamList, 'Prediction'>;

const Prediction: React.FC<PredictionProps> = ({route}) => {
  const {video} = route.params;

  const [data, setData] = useState<{result: string} | null>(null);

  const uploadVideo = async (videoUri: string) => {
    try {
      const formData = new FormData();
      formData.append('video', {
        uri: videoUri,
        type: 'video/mp4',
        name: 'upload.mp4',
      });
      const response = await fetch('http://192.168.29.109:5001/translate/', {
        method: 'post',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.ok) {
        const json = await response.json();
        setData(json);
      } else {
        console.error('Error uploading video', response);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const speak = () => {
    if (data?.result) {
      Tts.speak(data.result);
    }
  };

  useEffect(() => {
    uploadVideo(video);
  }, [video]);
  return (
    <View style={styles.container}>
      {data ? (
        <View style={styles.contentContainer}>
          <Video
            source={{uri: video}}
            style={styles.videoPlayer}
            controls={true}
            resizeMode="contain"
          />
          <View style={styles.resultContainer}>
            <Text style={styles.text}>{data.result}</Text>
            <Pressable style={styles.speakerButton} onPress={speak}>
              <Text style={styles.speakerText}>🔊</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <Text style={styles.text}>Please wait ...</Text>
      )}
    </View>
  );
};

export default Prediction;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  contentContainer: {
    width: '90%',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  videoPlayer: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: '#000',
  },
  resultContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  text: {
    fontSize: 18,
    color: '#333',
  },
  speakerButton: {
    padding: 10,
    borderRadius: 50,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  speakerText: {
    fontSize: 24,
    color: '#fff',
  },
});
