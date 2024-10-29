import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { useCreateUserProfileMutation } from "../hooks/api";
import { useEffect, useRef } from "react";
import SkeletonLoader from "../components/loaders/SkeletonLoader";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { user, getAccessTokenSilently } = useAuth0();
  const [createUserProfile] = useCreateUserProfileMutation();
  const hasCreatedUser = useRef(false);

  useEffect(() => {
    const createUser = async () => {
      if (user?.sub && user?.email && !hasCreatedUser.current) {
        try {
          const token = await getAccessTokenSilently();
          await createUserProfile({
            data: {
              email: user.email,
              auth0Id: user.sub
            },
            token
          }).unwrap();
          hasCreatedUser.current = true;
          navigate("/");
        } catch (e) {
          console.error("Error creating user profile:", e);
        }
      }
    };

    createUser();
  }, [createUserProfile, getAccessTokenSilently, user, navigate]);

  return <SkeletonLoader width="100%" height="50px"/>;
};

export default AuthCallback;
