import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./screens/login";
import SignupScreen from "./screens/signup";
import HomeScreen from "./screens/Homescreen";
import TicketsScreen from "./screens/Ticketscreen";
import MapScreen from "./screens/Mapscreen";
import registerNNPushToken from "native-notify";

const Stack = createStackNavigator();

export default function App() {
  registerNNPushToken(23299, "U5IjQWTJDK4k4DjbwcF0B4");
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Tickets" component={TicketsScreen} />
        <Stack.Screen name="Map" component={MapScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
