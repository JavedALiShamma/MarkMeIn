import {LinearGradient} from "expo-linear-gradient"
import colors from "../../styles/baseColors";

const LinearGradientColor =({height})=>{
    return( <LinearGradient
        colors={[ colors.primary, colors.white]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: `${height}%`,
        }}
      />)
}
export default LinearGradientColor;