import { Warehouse, ApiResponse } from "@/constants/types"; 


const BASE_URL = 'http://10.251.2.23:8000/api'; 

export const getWarehousesapi = async (): Promise<ApiResponse<Warehouse[]>> => {
  try {
    const response = await fetch("/warehouses/warehouses/");
    const data = await response.json();
    return data
  } catch (error: any) {
    return {
      statuscode: 500,
      status: "error",
      data: [],
      errorMessage: error.message || "Internal server error",
    };
  }
};

export const addWarehouseapi = async (
  newWarehouse: Warehouse
): Promise<ApiResponse<null>> => {
  try {
    const response = await fetch("/warehouses/warehouses/", {
      method: "POST",
      body: JSON.stringify(newWarehouse),
    });
    const data = await response.json();
    return data
  } catch (error: any) {
    return {
      statuscode: 500,
      status: "error",
      data: null,
      errorMessage: error.message || "Internal server error",
    };
  }
};


export const updateWarehouseapi = async (
  id: string,
  updatedWarehouse: Warehouse
): Promise<ApiResponse<null>> => {
  try {
    const response = await fetch(`/warehouses/warehouses/${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedWarehouse),
    });

    const data = await response.json();

    return data
  } catch (error: any) {
    return {
      statuscode: 500,
      status: "error",
      data: null,
      errorMessage: error.message || "Internal server error",
    };
  }
};



export const deleteWarehouseapi = async (
  id: string
): Promise<ApiResponse<null>> => {
  try {
    const response = await fetch(`/warehouses/warehouses/${id}/`, {
      method: "DELETE",
    });

    const data = await response.json();

    return data
  } catch (error: any) {
    return {
      statuscode: 500,
      status: "error",
      data: null,
      errorMessage: error.message || "Internal server error",
    };
  }
};
