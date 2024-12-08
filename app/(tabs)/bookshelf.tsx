import { StyleSheet, Text, View } from 'react-native';

export default function Bookshelf() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>我的书架</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  text: {
    fontSize: 20,
    color: '#333',
  },
}); 