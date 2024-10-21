import Form from "../Form";
import { register, resetStatus } from "../../../store/authSlice";
import { UserDataType } from "../types";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Status } from "../../../globals/types/types";

const Register = () => {
  const navigate = useNavigate();
  const { status } = useAppSelector((state) => state.auth);
  console.log(status);
  const dispatch = useAppDispatch();
  const handleRegister = async (data: UserDataType) => {
    dispatch(register(data));
  };
  useEffect(() => {
    if (status === Status.SUCCESS) {
      dispatch(resetStatus());
      navigate("/login");
    }
  }, [status, navigate, dispatch]);
  return <Form type="register" onSubmit={handleRegister} />;
};
export default Register;
