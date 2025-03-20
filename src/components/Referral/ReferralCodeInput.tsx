import { useState } from "react";

import { sendReferralCode } from "../../api/klang";
import InputError from "../InputError";
import { ReferralStatus } from "../../types/ReferralStatus";

function validateCode(code: string): boolean {
  const regex = /^[A-Z0-9]{5}$/; // Alphanumeric, exactly 5 characters
  if (regex.test(code)) {
    return true;
  }
  return false;
}

interface ReferralCodeInputProps {
  setReferralStatus: (status: ReferralStatus) => void;
}

async function sendCode(
  referralCode: string,
  setReferralStatus: (status: ReferralStatus) => void,
  setErrorMessage: (message: string) => void,
  setIsCodeValid: (isLoading: boolean) => void
) {
  setIsCodeValid(false);

  try {
    const isSuccessful = await sendReferralCode(referralCode);

    if (isSuccessful) {
      setReferralStatus(ReferralStatus.Completed);
    } else {
      setErrorMessage("Invalid Referral Code");
    }
  } catch (error) {
    setErrorMessage(
      error instanceof Error ? error.message : "An unknown error occurred"
    );
  }
}

function ReferralCodeInput({ setReferralStatus }: ReferralCodeInputProps) {
  const [referralCode, setReferralCode] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCodeValid, setIsCodeValid] = useState<boolean>(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const code = event.target.value.toUpperCase();
    setReferralCode(code);

    let isValid: boolean = validateCode(code);
    setIsCodeValid(isValid);

    setErrorMessage(
      isValid ? null : "Referral Code must be 5 alphanumeric characters."
    );
  };

  return (
    <div>
      <input
        type="text"
        value={referralCode}
        onChange={handleChange}
        maxLength={5}
        placeholder="Enter referral code"
        className="border border-gray-300 rounded-md p-2"
      />
      <InputError message={errorMessage} />
      <button
        onClick={() =>
          sendCode(
            referralCode,
            setReferralStatus,
            setErrorMessage,
            setIsCodeValid
          )
        }
        className={`btn ${!isCodeValid ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        Apply
      </button>
    </div>
  );
}

export default ReferralCodeInput;
