import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  input: {
    width: "90%",
    height: 40,
    borderRadius: 15,
    paddingLeft: 10,
    marginBottom: 15,
    fontSize: 17,
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
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold",
  },
  loadingThrobber: {
    marginTop: 10,
    marginBottom: 10,
  },
});

export default styles;
