import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  card: {
    marginTop: 10,
    marginBottom: 10,
    padding: 10,
    borderWidth: 0.8,
    borderColor: "#313134",
    borderRadius: 25,
    backgroundColor: "#000000",
  },
  emptyListText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 5,
    color: "#FFFFFF",
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
    color: "#8b8b90",
  },
  imageText: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: "center",
    color: "#8b8b90",
  },
  carText: {
    fontSize: 22,
    marginBottom: 5,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 10,
    marginBottom: 10,
    marginTop: 10,
    color: "#FFFFFF",
    backgroundColor: "#1c1c1e",
    fontSize: 17,
  },
  map: {
    width: "100%",
    height: 250,
    marginBottom: 20,
  },
  carImage: {
    width: "100%",
    height: 300,
    marginVertical: 10,
  },
  bigThrobber: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingThrobber: {
    alignSelf: 'center',
    marginVertical: 10,
  },
});

export default styles;
