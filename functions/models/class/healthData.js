class HealthData {
  /**
   * @param {string} HealthName - The name of the owner person.
   * @param {number} HealthAge - The age of the owner person.
   * @param {number} HealthGender - 0: Male | 1: Female
   * @param {number} HealthHeight - The height of the owner person.
   * @param {number} HealthWeight - The weight of the owner person.
   * @param {boolean} isCurrentUser - The owner person is the current user or not
   */

  constructor(name, age, gender, height, weight, isCurrentUser) {
    this.HealthName = name || null;
    this.HealthAge = age;
    this.HealthGender = gender;
    this.HealthHeight = height;
    this.HealthWeight = weight;
    this.isCurrentUser = isCurrentUser || null;
  }
}

module.exports = HealthData;
