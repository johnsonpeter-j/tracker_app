import type { AxiosResponse } from "axios";
import { client, normaliseError } from "@/api/http";

type SignInPayload = {
  email: string;
  password: string;
};

type SignUpPayload = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type ForgotPasswordPayload = {
  email: string;
};

export type AuthUser = {
  name: string;
  email: string;
  role: string;
  department: string;
  id: string;
};

export type AuthSuccessResponse = {
  token: string;
  user: AuthUser;
};

export type ApiFailureResponse = {
  message: string;
};

export async function signIn(
  payload: SignInPayload,
): Promise<AuthSuccessResponse> {
  try {
    const response: AxiosResponse<AuthSuccessResponse> = await client.post(
      "/auth/sign-in",
      payload,
    );
    return response.data;
  } catch (error: unknown) {
    throw normaliseError(error);
  }
}

export async function signUp(
  payload: SignUpPayload,
): Promise<AuthSuccessResponse> {
  try {
    const response: AxiosResponse<AuthSuccessResponse> = await client.post(
      "/auth/sign-up",
      payload,
    );
    return response.data;
  } catch (error: unknown) {
    throw normaliseError(error);
  }
}

export async function forgotPassword(
  payload: ForgotPasswordPayload,
): Promise<ApiFailureResponse> {
  try {
    const response: AxiosResponse<ApiFailureResponse> = await client.post(
      "/auth/forgot-password",
      payload,
    );
    return response.data;
  } catch (error: unknown) {
    throw normaliseError(error);
  }
}

type VerifyTokenPayload = {
  token: string;
};

export type VerifyTokenResponse = {
  valid: boolean;
  token: string;
  user?: AuthUser;
};

export async function verifyToken(
  payload: VerifyTokenPayload,
): Promise<VerifyTokenResponse> {
  try {
    const response: AxiosResponse<VerifyTokenResponse> = await client.post(
      "/auth/verify-token",
      payload,
    );
    return response.data;
  } catch (error: unknown) {
    throw normaliseError(error);
  }
}

