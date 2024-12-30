const { faker } = require("@faker-js/faker");
const bcrypt = require("bcrypt");
const User = require('../models/userModel.js');
const Business = require('../models/businessModel.js');

const plans = ["Standard", "Gold", "Platinum"];
const categories = ["Commerce", "Maintenance", "Finance", "Health", "Recreation", "General"];
const extraBit = [", So, it's great!", ", So, it's great!", ", So, it's great!", ". L O V E D it", ". L O V E D it", ". L O V E D it", ". quack", ". great success!", ", I find it offensive..."]

const UserAmount = 1000;
const BusinessAmount = 100;

const generateUsers = async function () {
    const users = await Promise.all(
        Array.from({ length: UserAmount }).map(async () => {
            const plainPassword = faker.internet.password(6);
            const password = await bcrypt.hash(plainPassword, 10);
            return {
                name: faker.internet.username().substring(0, 8),
                email: faker.internet.email({ firstName: this.name }),
                password,
                plainPassword,
                plan: plans[Math.floor(Math.random() * 3)]
            }
        })
    )
    return users;
}

const clearUsers = async function () {
    const result = await User.deleteMany({ name: { $ne: "user1" } })
}

const seedUsers = async function () {
    const newUsers = await generateUsers();
    // console.log("new users---------------------", newUsers);
    await User.insertMany(newUsers);
}

const generateBusinesses = async function () {
    const users = await User.find();
    // console.log("users---------------------------", users);
    const businesses = [];
    const businessOwnersIndex = BusinessAmount;
    for (let i = 1; i < businessOwnersIndex; i++) {
        const newBusiness = {
            name: faker.company.name(),
            description: faker.company.catchPhrase(),
            category: categories[Math.floor(Math.random() * categories.length)],
            owner: users[i]._id,
            subscribers: [users[businessOwnersIndex + (Math.floor(Math.random() * (users.length - businessOwnersIndex - 1)))]._id],//find a random user whose not a business owner
        }
        businesses.push(newBusiness);
    }
    return businesses;
}

const generateReviews = async function () {
    const users = await User.find();
    const businesses = await Business.find();
    businesses.forEach( business => {
        for(let i = 0; i < Math.ceil(Math.random() * 10); i++){
            // console.log("@ss");
            const review = {
                userId: users[Math.floor(Math.random() * users.length)]._id,
                comment: `${faker.company.catchPhraseDescriptor()} ${faker.company.catchPhraseNoun()}${extraBit[Math.floor(Math.random() * extraBit.length)]}`
            }
            business.reviews.push(review);
        }
        business.save();//should I await this?
    })
}

const seedBusinesses = async function () {
    const businesses = await generateBusinesses();
    await Business.insertMany(businesses);
    await generateReviews();
}

const seedDB = async function () {
    await clearUsers();
    await Business.deleteMany();
    await seedUsers();
    await seedBusinesses();
}
module.exports = { seedDB }