const admin = require("firebase-admin");
const db = admin.firestore();
const {v4: uuidv4} = require("uuid");

const UserAccount = require("./userAccount");

/**
 * Create class for community purposes
 */

const allowedUpdate = [
  "blogContent",
];

class CommunityBlog {
  // eslint-disable-next-line indent
    /**
     * @param {string} blogId - The id of the blog.
     * @param {string} regionId - The id of the region.
     * @param {string} senderId - The id of the sender.
     * @param {string} blogContent - The content of the blog.
     */

  constructor(regionId, senderId, blogContent) {
    this.blogId = uuidv4();
    this.regionId = regionId;
    this.senderId = senderId;
    this.blogContent = blogContent;
  }

  /**
   * Filter data attributes
   */
  static filter(data) {
    return Object.keys(data).reduce((filteredData, key) => {
      if (allowedUpdate.includes(key)) {
        filteredData[key] = data[key];
      }
      return filteredData;
    }, {});
  }

  /**
   * Create object from data
   */
  static fromData(data) {
    return new CommunityBlog(data.regionId, data.senderId, data.blogContent);
  }

  /**
   * ================================================================
   *                       CREATE METHODS
   * ================================================================
   */

  /**
   * Create a new blog
   * @param {Object} data - The data of the blog.
   * @returns {CommunityBlog}
   */
  static async create(data) {
    // fetch sender by id
    const sender = await UserAccount.fetchById(data.senderId);
    if (!sender) {
      throw new Error("Sender not found");
    }

    // create new blog
    data.regionId = sender.regionId;
    const newBlog = CommunityBlog.fromData(data);

    // save blog to firestore
    await db.collection("CommunityBlog").doc(newBlog.blogId).set(newBlog.toMap());

    return newBlog;
  }

  /**
   * ================================================================
   *                       READ METHODS
   * ================================================================
   */

  /**
   * Get a blog by ID
   */
  static async fetchById(blogId) {
    const blog = await db.collection("CommunityBlog").doc(blogId).get();
    if (!blog.exists) {
      return null;
    }
    return CommunityBlog.fromData(blog.data());
  }

  /**
   * Get all blogs
   */
  static async fetchAll() {
    const blogs = await db.collection("CommunityBlog").get();
    return blogs.docs.map((doc) => CommunityBlog.fromData(doc.data()));
  }

  /**
   * Get all blogs by region
   */
  static async fetchByRegion(regionId) {
    const blogs = await db.collection("CommunityBlog").where("regionId", "==", regionId).get();
    return blogs.docs.map((doc) => CommunityBlog.fromData(doc.data()));
  }

  /**
   * ================================================================
   *                       UPDATE METHODS
   * ================================================================
   */

  /**
   * Update blog content by ID
   */
  static async updateById(blogId, data) {
    const blogRef = db.collection("CommunityBlog").doc(blogId);
    if (!(await blogRef.get()).exists) {
      throw new Error("Blog not found");
    }

    const filteredData = CommunityBlog.filter(data);
    await blogRef.update(filteredData);

    const updatedDoc = await blogRef.get();
    return updatedDoc.data();
  }

  /**
   * ================================================================
   *                       DELETE METHODS
   * ================================================================
   */

  /**
   * Delete blog by ID
   */
  static async deleteById(blogId) {
    await db.collection("CommunityBlog").doc(blogId).delete();
  }
}

module.exports = CommunityBlog;
