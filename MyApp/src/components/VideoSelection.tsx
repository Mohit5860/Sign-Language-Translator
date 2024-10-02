import {Pressable, StyleSheet, Text, View, Alert} from 'react-native';
import React, {useState} from 'react';
import DocumentPicker from 'react-native-document-picker';
import {launchCamera} from 'react-native-image-picker';
import Video from 'react-native-video';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {StackParamList} from '../App';

type VideoSelectionProps = NativeStackScreenProps<StackParamList, 'Home'>;

const VideoSelection: React.FC<VideoSelectionProps> = ({navigation}) => {
  const [video, setVideo] = useState<string>('');

  const selectVideo = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.video],
      });
      setVideo(result[0].uri);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        Alert.alert('Cancelled', 'No video selected');
      } else {
        Alert.alert('Error', 'Unknown error occurred: ' + JSON.stringify(err));
      }
    }
  };

  const recordVideo = async () => {
    const options = {
      mediaType: 'video',
      durationLimit: 60,
      videoQuality: 'high',
    };

    launchCamera(options, response => {
      if (response.didCancel) {
        Alert.alert('Cancelled', 'User cancelled video recording');
      } else if (response.errorCode) {
        Alert.alert('Error', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        setVideo(response.assets[0].uri);
      }
    });
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.heading}>Please select a video to translate</Text>
        {video && (
          <Video
            source={{uri: video}}
            style={styles.videoPlayer}
            controls={true}
            resizeMode="contain"
          />
        )}
        <View style={styles.buttonContainer}>
          <Pressable style={styles.button} onPress={selectVideo}>
            <Text style={styles.buttonText}>Select Video</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={recordVideo}>
            <Text style={styles.buttonText}>Record Video</Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.whiteBackground}>
        <Pressable
          style={video ? styles.translateButton : styles.noVideo}
          onPress={
            video ? () => navigation.navigate('Prediction', {video}) : null
          }>
          <Text style={styles.translateButtonText}>Translate</Text>
        </Pressable>
      </View>
    </>
  );
};

export default VideoSelection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f6f9',
    padding: 20,
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  videoPlayer: {
    width: '90%',
    height: 250,
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: '#000',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  whiteBackground: {
    backgroundColor: '#fff',
    width: '100%',
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  translateButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  translateButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  noVideo: {
    backgroundColor: '#6c757d',
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 10,
    opacity: 0.7,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
