// script/graphql.js
const API_GRAPHQL = "https://learn.reboot01.com/api/graphql-engine/v1/graphql";

export async function fetchGraphQL(query, variables = {}) {
  const token = localStorage.getItem("jwt");
  const res = await fetch(API_GRAPHQL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });

  const response = await res.json();

  if (response.errors) {
    const errorMessage = response.errors[0].message;

    // Handle expired token
    if (errorMessage.includes("JWTExpired")) {
      localStorage.clear();
      alert("Your session has expired. Please log in again.");
      location.reload();
    }

    throw new Error(errorMessage);
  }

  return response.data;
}


export async function getUserInfo() {
  const query = `
    query {
      user {
        id
        login
        totalUp
        totalDown
        auditRatio
      }
    }
  `;
  const { user } = await fetchGraphQL(query);
  return user?.[0];
}

export async function getTransactions(userId) {
  const query = `
    query($userId: Int!) {
      transaction(where: { userId: { _eq: $userId } }, order_by: { createdAt: asc }) {
        id type amount createdAt path object { name type }
      }
    }
  `;
  const { transaction } = await fetchGraphQL(query, { userId });
  return transaction;
}

export async function getProgressData(userId) {
  const query = `
    query($userId: Int!) {
      progress(where: { userId: { _eq: $userId } }, order_by: { createdAt: asc }) {
        id grade createdAt path object { name type }
      }
    }
  `;
  const { progress } = await fetchGraphQL(query, { userId });
  return progress;
}
