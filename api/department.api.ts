import type { AxiosResponse } from "axios";
import { client, normaliseError } from "@/api/http";

export type DepartmentPayload = {
  name: string;
  description: string;
};

export type DepartmentResponse = {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  members: number;  
};

export type DepartmentListResponse = DepartmentResponse[];

export type DeleteDepartmentResponse = {
  message: string;
};

const RESOURCE = "/department";

export async function createDepartment(
  payload: DepartmentPayload,
): Promise<DepartmentResponse> {
  try {
    const response: AxiosResponse<DepartmentResponse> = await client.post(
      RESOURCE,
      payload,
    );
    return response.data;
  } catch (error: unknown) {
    throw normaliseError(error);
  }
}

export async function getDepartments(): Promise<DepartmentListResponse> {
  try {
    const response: AxiosResponse<DepartmentListResponse> = await client.get(
      RESOURCE,
    );
    return response.data;
  } catch (error: unknown) {
    throw normaliseError(error);
  }
}

export async function updateDepartment(
  id: string,
  payload: DepartmentPayload,
): Promise<DepartmentResponse> {
  try {
    const response: AxiosResponse<DepartmentResponse> = await client.put(
      `${RESOURCE}/${id}`,
      payload,
    );
    return response.data;
  } catch (error: unknown) {
    throw normaliseError(error);
  }
}

export async function deleteDepartment(
  id: string,
): Promise<DeleteDepartmentResponse> {
  try {
    const response: AxiosResponse<DeleteDepartmentResponse> = await client.delete(
      `${RESOURCE}/${id}`,
    );
    return response.data;
  } catch (error: unknown) {
    throw normaliseError(error);
  }
}




