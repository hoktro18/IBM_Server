const {getMessaging} = require("firebase-admin/messaging");

require("firebase-admin/messaging");

/**
 * Function to send a notification to a topic
 */
const sendNotification = (regionId, type, date, stormLevel) => {
  const title = "WARNING!!!";
  const body = "INCOMING " + type.toUpperCase() + ".";

  const message = {
    notification: {
      title: title,
      body: body,
    },
    data: {
      date: date,
      stormLevel: stormLevel,
    },
    topic: regionId,
  };

  getMessaging().send(message)
      .then((response) => {
        console.log("Successfully sent message:", response);
      })
      .catch((error) => {
        console.log("Error sending message:", error);
      });
};

/**
 * Subscribe client token to a topic
 */
const subscribeToTopic = (token, topic) => {
  getMessaging().subscribeToTopic(token, topic)
      .then((response) => {
        console.log("Successfully subscribed to topic:", response);
      })
      .catch((error) => {
        console.log("Error subscribing to topic:", error);
      });
};

/**
 * Unsubscribe client token from a topic
 */
const unsubscribeFromTopic = (token, topic) => {
  getMessaging().unsubscribeFromTopic(token, topic)
      .then((response) => {
        console.log("Successfully unsubscribed from topic:", response);
      })
      .catch((error) => {
        console.log("Error unsubscribing from topic:", error);
      });
};

module.exports = {sendNotification, subscribeToTopic, unsubscribeFromTopic};
