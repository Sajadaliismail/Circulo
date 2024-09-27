const { driver, connectNeo, closeConnection } = require("../Database/neo4j");

const addUserDetails = async (user) => {
  const session = driver.session();
  try {
    console.log("Neo4j Connection open");

    await session.run(
      `MERGE (u:User {id: $id})
       ON CREATE SET u.firstName = $firstName,
                     u.lastName = $lastName,
                     u.postalCode = $postalCode,
                     u.email = $email
       ON MATCH SET  u.firstName = $firstName,
                     u.lastName = $lastName,
                     u.postalCode = $postalCode,
                     u.email = $email`,
      {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        postalCode: user.postalCode,
        email: user.email,
      }
    );
    console.log("User added/updated in the Neo4j database");
  } catch (error) {
    console.error("Error adding/updating user details:", error);
    throw error;
  } finally {
    console.log("Neo4j Connection closed");
    await session.close();
  }
};

const updateProfilePicture = async (userData) => {
  const session = driver.session();
  try {
    console.log("Neo4j Connection open");
    await session.run(
      `MERGE (u:User {id: $userId})
       SET u.profilePicture = $profilePicture`,
      { userId: userData._id, profilePicture: userData.profilePicture }
    );
    console.log("User image updated in neo4j Database");
  } catch (error) {
    console.error("Error updating profile picture:", error);
    throw error;
  } finally {
    console.log("Neo4j Connection closed");
    await session.close();
  }
};

const sendFriendRequestService = async (userId, friendId) => {
  const session = driver.session();
  try {
    console.log("Neo4j Connection open");

    const checkRequestResult = await session.run(
      `MATCH (u:User {id: $userId})-[r:FRIEND_REQUEST]->(f:User {id: $friendId})
       RETURN COUNT(r) AS requestCount`,
      { userId, friendId }
    );

    const requestCount = checkRequestResult.records[0]
      .get("requestCount")
      .toInt();

    if (requestCount > 0) {
      throw new Error("Friend request already sent.");
    }

    await session.run(
      `MATCH (u:User {id: $userId}), (f:User {id: $friendId})
       CREATE (u)-[:FRIEND_REQUEST]->(f)`,
      { userId, friendId }
    );

    return { success: true, message: "Friend request sent successfully." };
  } catch (error) {
    console.error("Error sending friend request:", error);
    throw error;
  } finally {
    console.log("Neo4j Connection close");

    await session.close();
  }
};

const acceptFriendRequest = async (userId, friendId) => {
  const session = driver.session();
  try {
    await session.run(
      `MATCH (u:User {id: $userId})<-[r:FRIEND_REQUEST]-(f:User {id: $friendId})
       DELETE r
       CREATE (u)-[:FRIEND]->(f)
       CREATE (f)-[:FRIEND]->(u)`,
      { userId, friendId }
    );
  } catch (error) {
    console.error("Error accepting friend request:", error);
    throw error;
  } finally {
    await session.close();
  }
};

const cancelFriendRequest = async (userId, friendId) => {
  const session = driver.session();
  try {
    await session.run(
      `MATCH (u:User {id: $friendId})-[r:FRIEND_REQUEST]-(f:User {id: $userId})
       DELETE r`,
      { userId, friendId }
    );
  } catch (error) {
    console.error("Error canceling friend request:", error);
    throw error;
  } finally {
    await session.close();
  }
};

const getRequestsService = async (userId) => {
  const session = driver.session();
  try {
    const incomingRequestsResult = await session.run(
      `MATCH (u:User {id: $userId})<-[:FRIEND_REQUEST]-(requester)
       RETURN requester`,
      { userId }
    );

    const incomingRequests = incomingRequestsResult.records.map(
      (record) => record.get("requester").properties
    );

    return incomingRequests;
  } catch (error) {
    console.error("Error retrieving incoming friend requests:", error);
    throw error; // Re-throw the error if you need to handle it upstream
  }
};

const getFriendsService = async (userId) => {
  const session = driver.session();
  try {
    const friends = await session.run(
      `MATCH (u:User {id : $userId})<-[r:FRIEND]-(friends) RETURN friends`,
      { userId }
    );
    const result = friends.records.map((record) => {
      const res = record.get("friends").properties;
      return res.id;
    });
    return result;
  } catch (error) {
    console.log(error);
  }
};

const getUserRelation = async (id, userId) => {
  const session = driver.session();
  try {
    const result = await session.run(
      `MATCH (u1:User {id: $id}), (u2:User {id: $userId})
OPTIONAL MATCH (u1)-[relation]-(u2)
OPTIONAL MATCH (u1)-[:FRIEND]-(friend) 
RETURN 
  CASE
    WHEN u1.id = u2.id THEN 'SELF'
    WHEN relation IS NULL THEN 'NOT_FRIENDS'
    WHEN type(relation) = 'FRIEND' THEN 'FRIENDS'
    WHEN type(relation) = 'FRIEND_REQUEST' AND startNode(relation).id = $id THEN 'REQUESTRECEIVED'
    WHEN type(relation) = 'FRIEND_REQUEST' AND endNode(relation).id = $id THEN 'REQUESTSENT'
    ELSE 'not friends'
  END AS relationshipStatus,
  COUNT(DISTINCT friend) AS friendsCount
`,
      { id, userId }
    );

    const relation = result.records.map((record) => {
      const res = record.get("relationshipStatus");
      const res1 = record.get("friendsCount").toNumber();
      return {
        relation: res,
        friendsCount: res1,
      };
    });

    return relation[0];
  } catch (error) {
    console.log(error);
  }
};

const removeUserFriend = async (friendId, userId) => {
  const session = driver.session();

  try {
    const remove = await session.run(
      `MATCH (u:User {id: $userId})-[r:FRIEND]-(f:User {id: $friendId})
   DELETE r`,
      { userId, friendId }
    );
    return { relation: "NOTFRIENDS" };
  } catch (error) {
    console.log(error);
  }
};
const getFriendsServiceApi = async (userId) => {
  const session = driver.session();
  try {
    const friends = await session.run(
      `MATCH (u:User {id : $userId})-[r:FRIEND]-(friends) RETURN friends`,
      { userId }
    );
    const result = friends.records.map((record) => {
      const res = record.get("friends").properties;
      return res.id;
    });

    return result;
  } catch (error) {
    console.log(error);
  }
};
const getSuggestions = async (userId, { postalCode }) => {
  const session = driver.session();
  const uniqueUsers = new Set();
  const suggestions = [];

  try {
    if (!postalCode) {
      const userResult = await session.run(
        `MATCH (u:User {id: $userId})
         RETURN u.postalCode AS postalCode`,
        { userId }
      );

      if (userResult.records.length === 0) {
        throw new Error("User not found");
      }

      postalCode = userResult.records[0].get("postalCode");
    }

    // Function to run query and map results
    const runQuery = async (query, params) => {
      const result = await session.run(query, params);
      return result.records.map((record) => ({
        ...record.get("suggestion").properties,
        hasRequested: record.get("hasRequested"),
      }));
    };

    // Get outgoing friend requests
    const outgoingRequestsResult = await session.run(
      `MATCH (u:User {id: $userId})-[:FRIEND_REQUEST]->(requestee:User)
       RETURN requestee AS requestee,
              EXISTS((u)-[:FRIEND_REQUEST]->(requestee)) AS hasRequested`,
      { userId }
    );

    const outgoingRequestsWithDetails = outgoingRequestsResult.records.map(
      (record) => {
        const requestee = record.get("requestee").properties;
        const hasRequested = record.get("hasRequested");
        return { ...requestee, hasRequested };
      }
    );

    // Get incoming friend requests
    const incomingRequestsResult = await session.run(
      `MATCH (u:User {id: $userId})<-[:FRIEND_REQUEST]-(requester:User)
       RETURN requester.id AS requesterId`,
      { userId }
    );
    const incomingRequestIds = new Set(
      incomingRequestsResult.records.map((record) => record.get("requesterId"))
    );

    // Get friends of friends
    const friendsOfFriends = await runQuery(
      `MATCH (u:User {id: $userId})-[:FRIEND]->(friend)-[:FRIEND]->(suggestion)
       WHERE NOT (u)-[:FRIEND]->(suggestion) AND suggestion.id <> $userId
         AND NOT suggestion.id IN $incomingRequestIds
         AND NOT EXISTS {
           MATCH (suggestion)<-[:FRIEND_REQUEST]-(u)
         }
       RETURN suggestion, EXISTS((u)-[:FRIEND_REQUEST]->(suggestion)) AS hasRequested`,
      { userId, incomingRequestIds: Array.from(incomingRequestIds) }
    );

    for (const user of friendsOfFriends) {
      if (!uniqueUsers.has(user.id)) {
        uniqueUsers.add(user.id);
        suggestions.push(user);
      }
    }

    if (suggestions.length >= 20) {
      return suggestions.slice(0, 20);
    }

    // Get nearby people
    const nearbyPeople = await runQuery(
      `MATCH (u:User {id: $userId}), (suggestion:User {postalCode: $postalCode})
       WHERE NOT (u)-[:FRIEND]->(suggestion) AND suggestion.id <> $userId
         AND NOT suggestion.id IN $incomingRequestIds
         AND NOT EXISTS {
           MATCH (suggestion)<-[:FRIEND_REQUEST]-(u)
         }
       RETURN suggestion, EXISTS((u)-[:FRIEND_REQUEST]->(suggestion)) AS hasRequested`,
      { userId, postalCode, incomingRequestIds: Array.from(incomingRequestIds) }
    );

    for (const user of nearbyPeople) {
      if (!uniqueUsers.has(user.id)) {
        uniqueUsers.add(user.id);
        suggestions.push(user);
      }
    }

    if (suggestions.length >= 20) {
      return suggestions.slice(0, 20);
    }

    // Get other users
    const otherUsers = await runQuery(
      `MATCH (u:User {id: $userId}), (suggestion:User)
       WHERE NOT (u)-[:FRIEND]->(suggestion) AND suggestion.id <> $userId
         AND NOT suggestion.id IN $incomingRequestIds
         AND NOT EXISTS {
           MATCH (suggestion)<-[:FRIEND_REQUEST]-(u)
         }
       RETURN suggestion, EXISTS((u)-[:FRIEND_REQUEST]->(suggestion)) AS hasRequested
       LIMIT 10`,
      { userId, incomingRequestIds: Array.from(incomingRequestIds) }
    );

    for (const user of otherUsers) {
      if (!uniqueUsers.has(user.id)) {
        uniqueUsers.add(user.id);
        suggestions.push(user);
      }
    }

    // Ensure the final list is unique and limited to 20
    const uniqueSuggestions = Array.from(uniqueUsers).slice(0, 20);

    // If no unique suggestions found, look for users with the same postal code
    if (suggestions.length === 0) {
      const Users = await session.run(
        `MATCH (u:User {postalCode: $postalCode}) RETURN u`,
        { postalCode }
      );
      const usersData = Users.records.map(
        (record) => record.get("u").properties
      );
      return Array.from(new Set(usersData.map((user) => user.id))).slice(0, 20);
    }

    return suggestions.length < 20
      ? Array.from(
          new Set([...suggestions, ...outgoingRequestsWithDetails])
        ).slice(0, 20)
      : suggestions;
  } catch (error) {
    console.error("Error getting suggestions:", error);
    throw error;
  } finally {
    await session.close();
  }
};

module.exports = {
  sendFriendRequestService,
  acceptFriendRequest,
  getSuggestions,
  addUserDetails,
  updateProfilePicture,
  cancelFriendRequest,
  getRequestsService,
  getFriendsService,
  getFriendsServiceApi,
  getUserRelation,
  removeUserFriend,
};
