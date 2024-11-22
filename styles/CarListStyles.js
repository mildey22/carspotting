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
  imageText: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: "center",
  },
  carText: {
    fontSize: 22,
    marginBottom: 5,
    fontWeight: "bold",
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
  bigThrobber: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    alignSelf: 'center',
    marginVertical: 10,
  },
});

export default styles;
