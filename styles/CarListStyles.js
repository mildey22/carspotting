import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  card: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    backgroundColor: "#f9f9f9",
  },
  loadingText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 5,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
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
  map: {
    width: "100%",
    height: 200,
    marginTop: 10,
  },
  carImage: {
    width: "100%",
    height: 200,
    marginVertical: 10,
  },
});

export default styles;
