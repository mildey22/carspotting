import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  input: {
    width: "90%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingLeft: 10,
    marginBottom: 15,
  },
  map: {
    width: "100%",
    height: 300,
    marginBottom: 10,
  },
  text: {
    fontSize: 20,
    marginBottom: 5,
  },
  headline: {
    fontSize: 24,
    marginBottom: 20,
  },
  toggleButton: {
    marginBottom: 5,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#007BFF",
  },
  deleteButton: {
    flexDirection: 'row',
    marginBottom: 5,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#DC3545",
  },
  toggleButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  saveButton: {
    flexDirection: 'row',
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  
  disabledButton: {
    backgroundColor: '#b0b0b0', 
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  iconButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  iconButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  loadingThrobber: {
    marginTop: 10, 
    marginBottom: 10,
  },
});

export default styles;
