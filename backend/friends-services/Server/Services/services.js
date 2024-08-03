const { driver, connectNeo, closeConnection } = require("../Database/neo4j");

const addUserDetails = async (user) => {
  const session = driver.session();
  try {
    console.log("Neo4j Connection open");

    await session.run(
      `MERGE (u:User {id: $id})
       SET u.firstName = $firstName,
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
    console.log("User added to the neo4j Database");
  } catch (error) {
    console.error("Error adding user details:", error);
    throw error;
  } finally {
    console.log("Neo4j Connection closed");
    await session.close();
  }
};

const updateProfilePicture = async (userData) => {
  console.log(userData);
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
    const result = friends.records.map(
      (record) => record.get("friends").properties
    );
    console.log(result, "asff");
    return result;
  } catch (error) {
    console.log(error);
  }
};
const getSuggestions = async (userId) => {
  const session = driver.session();
  try {
    const userResult = await session.run(
      `MATCH (u:User {id: $userId})
       RETURN u.postalCode AS postalCode`,
      { userId }
    );

    if (userResult.records.length === 0) {
      throw new Error("User not found");
    }

    const postalCode = userResult.records[0].get("postalCode");

    // Function to run query and map results
    const runQuery = async (query, params) => {
      const result = await session.run(query, params);
      return result.records.map((record) => ({
        ...record.get("suggestion").properties,
        hasRequested: record.get("hasRequested"),
      }));
    };

    const outgoingRequestsResult = await session.run(
      `MATCH (u:User {id: $userId})-[:FRIEND_REQUEST]->(requestee:User)
   RETURN requestee AS requestee,
          EXISTS((u)-[:FRIEND_REQUEST]->(requestee)) AS hasRequested`,
      { userId }
    );

    // Process the result to include full details and the hasRequested field
    const outgoingRequestsWithDetails = outgoingRequestsResult.records.map(
      (record) => {
        const requestee = record.get("requestee").properties;
        const hasRequested = record.get("hasRequested");
        return {
          ...requestee,
          hasRequested,
        };
      }
    );
    // Get users who have sent requests to the current user
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

    if (friendsOfFriends.length >= 20) {
      return friendsOfFriends.slice(0, 20);
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

    friendsOfFriends.push(...nearbyPeople);

    if (friendsOfFriends.length >= 20) {
      return friendsOfFriends.slice(0, 20);
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

    friendsOfFriends.push(...otherUsers);

    const uniqueSuggestions = Array.from(
      new Map(friendsOfFriends.map((item) => [item.id, item])).values()
    );
    if (uniqueSuggestions.length < 20)
      return uniqueSuggestions.concat(outgoingRequestsWithDetails).slice(0, 20);
    return;
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
};
