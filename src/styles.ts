import {colors} from "./Tx/colors";

export const modalStyle = {
  modal: {
    content : {
      top                   : "50%",
      left                  : "50%",
      right                 : "auto",
      bottom                : "auto",
      marginRight           : "-50%",
      transform             : "translate(-50%, -50%)",
      backgroundColor       : colors.dark,
      color                 : "white",
    },
  },
  overlay: {
    content : {
      backgroundColor       : colors.black,
    },
  },

};