import randomize from "randomatic";

export const generateOTP = () => {
    return randomize("0", 6);
};
