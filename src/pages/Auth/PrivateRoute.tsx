import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import Loading from "../../components/Loading/Loading";
import { useGetProfileQuery } from "../../store/apiSlice";

interface IPrivateRouteProps {
  children: React.ReactNode;
}

function PrivateRoute({ children }: IPrivateRouteProps) {
  const { pathname } = useLocation();
  const { data, isLoading } = useGetProfileQuery(undefined);

  if (isLoading) return <Loading />;

  if (!data?.user.name || !data?.user.email) {
    return <Navigate to={"/registration"} replace state={{ from: pathname }} />;
  }

  localStorage.setItem("userId", data.user.id);
  return <>{children}</>;
}

export default PrivateRoute;
