import { StyleSheet } from "react-native";


const buttonStyles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1c1c1e',
    padding: 10,
    borderRadius: 150,
    marginBottom: 10,
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#3b82f7',
    fontWeight: 'bold',
    marginLeft: 7,
    fontSize: 16,
  },
  saveButton: {
    flexDirection: 'row',
    backgroundColor: '#1c1c1e',
    padding: 12,
    borderRadius: 150, 
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#007aff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  deleteCarButton: {
    flexDirection: 'row',
    marginBottom: 5,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 150,
    backgroundColor: "#1c1c1e",
  },
  deleteButton: {
    flexDirection: 'row',
    marginBottom: 5,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 150,
    backgroundColor: "#1c1c1e",
  },
  deleteButtonText: {
    color: "#ff3b30",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 7,
  },
  disabledButton: {
    backgroundColor: '#1c1c1e', 
  },
  disabledButtonText: {
    color: '#818181',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  }
});

export default buttonStyles;