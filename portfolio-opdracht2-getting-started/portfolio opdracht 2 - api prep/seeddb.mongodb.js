/* global use, db */
// MongoDB Playground
// To disable this template go to Settings | MongoDB | Use Default Template For Playground.
// Make sure you are connected to enable completions and to be able to run a playground.
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.
// The result of the last command run in a playground is shown on the results panel.
// By default the first 20 documents will be returned with a cursor.
// Use 'console.log()' to print to the debug output.
// For more documentation on playgrounds please refer to
// https://www.mongodb.com/docs/mongodb-vscode/playgrounds/

use('dbGoesBrrrrrr');


// db.categories.deleteMany({});
// db.contracts.deleteMany({});
// db.fields.deleteMany({});
// db.identities.deleteMany({});
// db.organisations.deleteMany({});
// db.templates.deleteMany({});
// db.users.deleteMany({});


// db users -->
// db.createUser(
//     {
//         user: "mustrum_ridcully",
//         pwd: "fasdSDiDE34341ab",
//         roles: [
//             "readWrite",
//             "dbOwner",
//         ]
//     }
// );
// db.createUser(
//     {
//         user: "adminForApp",
//         pwd: "fasdSDiDE34341ab",
//         roles: [
//             "readWrite",
//             "dbOwner",
//         ]
//     }
// );
// domain entities -->
let identityBeheerder = {
    "email": "beheerder@da.nl",
    "hash": "$2b$10$pe3UOQtIQChr8Og7prWqO.hSiuHgOk5DWqdEfaxU8lGXX/RvVGEgK", //Avans1234
    "id": "41bdaccdc7b946469e7822c4",
    "_id": "41bdaccdc7b946469e7822c4"
},
 identitySalesuser1 = {
    "email": "salesuser1@da.nl",
    "hash": "$2b$10$pe3UOQtIQChr8Og7prWqO.hSiuHgOk5DWqdEfaxU8lGXX/RvVGEgK", //Avans1234
    "id": "c0685c3d85d942c6a0d8c68b",
    "_id": "c0685c3d85d942c6a0d8c68b",
},
 identitySalesuser2 = {
    "email": "salesuser2@da.nl",
    "hash": "$2b$10$pe3UOQtIQChr8Og7prWqO.hSiuHgOk5DWqdEfaxU8lGXX/RvVGEgK", //Avans1234
    "id": "87542dd675e047f29c64a02a",
    "_id": "87542dd675e047f29c64a02a",
};

let userBeheerder = {
    "_id": "41bdaccdc7b946469e7822c4",
    "id": "41bdaccdc7b946469e7822c4",
    "name": "beheerder",
    "email": "beheerder@da.nl",
    "jobTitle": "administrator",
    "role": "admin",
    "organisations": []
}
, userSalesuser1 = {
    "_id": "c0685c3d85d942c6a0d8c68b",
    "id": "c0685c3d85d942c6a0d8c68b",
    "name": "salesuser1",
    "email": "salesuser1@da.nl",
    "jobTitle": "verkoper",
    "role": "sales",
    "organisations": [
        "71c43fb6b5e7489ba2e59afc"
    ]
  }
  , userSalesuser2 = {
    "_id": "87542dd675e047f29c64a02a",
    "id": "87542dd675e047f29c64a02a",
    "name": "salesuser2",
    "email": "salesuser2@da.nl",
    "jobTitle": "verkoper",
    "role": "sales",
    "organisations": [
        "71c43fb6b5e7489ba2e59afc"
    ]
 };

  db.getCollection('identities').insertMany([
    identityBeheerder,
    identitySalesuser1,
    identitySalesuser2,
]);


db.getCollection('users').insertMany([
    userBeheerder,
    userSalesuser1,
    userSalesuser2,
]);
// FOLLOWING ENTITIES ARE BETTER CREATED USING POSTMAN COLLECTION, DO NOT USE THESE INSERTS -->

// postman
// let template1 = {
//     "_id": "84926ca7be2449e18c41dac0",
//     "id": "84926ca7be2449e18c41dac0",
//     "name": "template1",
//     "content": "bla bla",
//     "templateImage": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCABfAGYDASIAAhEBAxEB/8QAHAABAAMAAwEBAAAAAAAAAAAAAAQFBgECAwcI/8QAPxAAAQQBAwIEAgUFEQAAAAAAAQACAwQFBhESITETQVFhIjIHFFJicRUWRLHSFyMmNTZHU3JzdJOhsrTB0fD/xAAXAQEBAQEAAAAAAAAAAAAAAAAAAQID/8QAHxEBAQEAAgICAwAAAAAAAAAAAAERAiESMUHwIoHx/9oADAMBAAIRAxEAPwD9UoiICIiAiIgIiICIiAiKrGXbJnvyZWhMpjj52JQ7ZsX2W+5PoiWye1oiIiiIiAiIgIiICIiAiKNkr0GNozW7b+EMTdyfX2HuhbndQdSZR+OqxxVGeNkbTvCrQ/ad5uP3WjqSu+nsSzEUfDLzLZkd4k8x7yPPc/8ASg6apT2bEmcyjONyw3jDEf0eHuGj3PclaJHPhLyvlf0IiI6KXVOpKOma1OxkhL4NmyKwdGzlwJa53Ij0AYd1bV54rMEc1eRssMgDmPYdw4HzBWY101r8hpFrwHNOZaCCOhH1awolnT2cxE8kOkbdaDH2zs+KyC76mT3kiHn5/Cem+3utZMiauMlqrGUM/Rwz5HSX7TuIZGN/D6dC8+W69J9SY+vqqHT873R3pq4sxFw+B45OHEH7Xwk7eizORwNTA29MxVucs0uSD57Mp5Szv4Hdzj/4Bd87h4c3r2/VlcY5Bh68kMzfmikE83F4PqCrkTa3qz8mqqTNJHUIisOqDswNHMnxOG22+3f3XOk8xNkKs9TJNbHl6LvCtRjsT5PH3XDqFi/5jmf12/7sKSd9ra1I1ZaI3Gl87/hM/bU+/qFmPwUeVu0bkMHJomY5gL4Gk7F7gD2Hc7b9FCm1hBWmfAcNqGQxks5xYyVzHbdNwQOo91fVZo8ljmSOglZFOzrFYjLHAHuHNPUfgUsz3BIikZLE2SNzXxvAc1wO4IPmso535zZUzBrpMLjnEtaP0qcenq1v+ZVO2vax1t+kqd9gozPDo5C7aStAdyYgT3J68fPbdb+lVhpVIq1WMRwRNDWNHkFK5387nxPv3+srf1tJQpz2rWm85HXgYZJHmJmzWgbk/MvetqyxYMXHTWbDJNtnuiZsAfP5lI+kX+QWof7jN/oKuMZ/FtT+xZ+oK9Y6fKSiIsqy+tWOfktI8Wl3HMNJ2G+w+rz9VqERW3Rl9Ysc7K6ZLWkhuQBJA7DiVzCx37p1x/E8PyPAOW3Tfxpei06JqYzGrMZaisRZ7Bs5ZOq3jJBvsLcPcxn7w7tPr+KyTeR+gqN7opWn4ZCxzDyaPrQJ3HfsvqibdFZywxlWa+0yGNByY32/oZP2VOyOoYGYSK7jAbclpwiqMa0jxHnfbv2A2JJPkFbW5oKlaWxYc1kUbS5zj5AKPhbr8jjorT67q4kJcxjj14+RPpuFLiXb1L2ojpCGzp+aremcclO8WH3GfOycdWub6BvYD039VL0hl7N6CxRy0YizGPcIrIaPhk3+WVn3XAE+xBHktAib1hOM4zIz/wBITXP0Jn2tBc40ZgABuT8BVxjQRjqoI2IiZ+oKQib1jQiIoCIiAiIgIiotS2rUkkGJxvJlq2CXzAdIYh8zvx8gicr4zUWz/CXLmqw74ei/9/cO1iYdox91vc+/RacAAbAbAKNjaUGOow1KrAyGJvFo/wCT7nupKM8ONnd9iIiNiIiAiIgIiICIiAiIgIiICIiAiIgIiIP/2Q==",
// };

// postman
// let categoryA = {
//     "_id": "1ef888265bdc49f0a706c4c5",
//     "id": "1ef888265bdc49f0a706c4c5",
//     "name": "catA",
//     "priority": 1
// },

//  categoryB = {
//     "_id": "0c8d8a2e38494ddfa60b2e62",
//     "id": "0c8d8a2e38494ddfa60b2e62",
//     "name": "catB",
//     "priority": 2
// },

//  categoryC = {
//     "_id": "65b1d02966014f638d5faa8c",
//     "id": "65b1d02966014f638d5faa8c",
//     "name": "catC",
//     "priority": 3
// };

// postman
// let field1 = {
//     "_id": "e42496f3962d47ad8ec48079",
//     "id": "e42496f3962d47ad8ec48079",
//     "name": "Field1",
//     "shortcodeName": "1",
//     "category": "1ef888265bdc49f0a706c4c5", // catA
//     "isSpecifiable": true
// };

// postman
// let organisationNightWatch = {
//     "_id": "71c43fb6b5e7489ba2e59afc",
//     "id": "71c43fb6b5e7489ba2e59afc",
//     "name": "Night Watch",
//     "organisationImage": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCABfAGYDASIAAhEBAxEB/8QAHAABAAMAAwEBAAAAAAAAAAAAAAQFBgECAwcI/8QAPxAAAQQBAwIEAgUFEQAAAAAAAQACAwQFBhESITETQVFhIjIHFFJicRUWRLHSFyMmNTZHU3JzdJOhsrTB0fD/xAAXAQEBAQEAAAAAAAAAAAAAAAAAAQID/8QAHxEBAQEAAgICAwAAAAAAAAAAAAERAiESMUHwIoHx/9oADAMBAAIRAxEAPwD9UoiICIiAiIgIiICIiAiKrGXbJnvyZWhMpjj52JQ7ZsX2W+5PoiWye1oiIiiIiAiIgIiICIiAiKNkr0GNozW7b+EMTdyfX2HuhbndQdSZR+OqxxVGeNkbTvCrQ/ad5uP3WjqSu+nsSzEUfDLzLZkd4k8x7yPPc/8ASg6apT2bEmcyjONyw3jDEf0eHuGj3PclaJHPhLyvlf0IiI6KXVOpKOma1OxkhL4NmyKwdGzlwJa53Ij0AYd1bV54rMEc1eRssMgDmPYdw4HzBWY101r8hpFrwHNOZaCCOhH1awolnT2cxE8kOkbdaDH2zs+KyC76mT3kiHn5/Cem+3utZMiauMlqrGUM/Rwz5HSX7TuIZGN/D6dC8+W69J9SY+vqqHT873R3pq4sxFw+B45OHEH7Xwk7eizORwNTA29MxVucs0uSD57Mp5Szv4Hdzj/4Bd87h4c3r2/VlcY5Bh68kMzfmikE83F4PqCrkTa3qz8mqqTNJHUIisOqDswNHMnxOG22+3f3XOk8xNkKs9TJNbHl6LvCtRjsT5PH3XDqFi/5jmf12/7sKSd9ra1I1ZaI3Gl87/hM/bU+/qFmPwUeVu0bkMHJomY5gL4Gk7F7gD2Hc7b9FCm1hBWmfAcNqGQxks5xYyVzHbdNwQOo91fVZo8ljmSOglZFOzrFYjLHAHuHNPUfgUsz3BIikZLE2SNzXxvAc1wO4IPmso535zZUzBrpMLjnEtaP0qcenq1v+ZVO2vax1t+kqd9gozPDo5C7aStAdyYgT3J68fPbdb+lVhpVIq1WMRwRNDWNHkFK5387nxPv3+srf1tJQpz2rWm85HXgYZJHmJmzWgbk/MvetqyxYMXHTWbDJNtnuiZsAfP5lI+kX+QWof7jN/oKuMZ/FtT+xZ+oK9Y6fKSiIsqy+tWOfktI8Wl3HMNJ2G+w+rz9VqERW3Rl9Ysc7K6ZLWkhuQBJA7DiVzCx37p1x/E8PyPAOW3Tfxpei06JqYzGrMZaisRZ7Bs5ZOq3jJBvsLcPcxn7w7tPr+KyTeR+gqN7opWn4ZCxzDyaPrQJ3HfsvqibdFZywxlWa+0yGNByY32/oZP2VOyOoYGYSK7jAbclpwiqMa0jxHnfbv2A2JJPkFbW5oKlaWxYc1kUbS5zj5AKPhbr8jjorT67q4kJcxjj14+RPpuFLiXb1L2ojpCGzp+aremcclO8WH3GfOycdWub6BvYD039VL0hl7N6CxRy0YizGPcIrIaPhk3+WVn3XAE+xBHktAib1hOM4zIz/wBITXP0Jn2tBc40ZgABuT8BVxjQRjqoI2IiZ+oKQib1jQiIoCIiAiIgIiotS2rUkkGJxvJlq2CXzAdIYh8zvx8gicr4zUWz/CXLmqw74ei/9/cO1iYdox91vc+/RacAAbAbAKNjaUGOow1KrAyGJvFo/wCT7nupKM8ONnd9iIiNiIiAiIgIiICIiAiIgIiICIiAiIgIiIP/2Q==",
//     "organisationIdentifier": "org1",
//     "address": "Alaaf 42",
//     "city": "Ankh-Morpork",
//     "zipcode": "1234AB",
//     "country": "discworld",
//     "representative": "salesuser2",
// };


// postman
//   let contractContract1 = {
//     "_id": "f97f02bf72a54fc99bdfe89b",
//     "id": "f97f02bf72a54fc99bdfe89b",
//     "title": "Contract 1",
//     "organisation": "71c43fb6b5e7489ba2e59afc", // Night Watch
//     "lastEditedBy": {
//         "_id": "87542dd675e047f29c64a02a",
//         "id": "87542dd675e047f29c64a02a",
//         "name": "salesuser2",
//         "email": "salesuser2@da.nl",
//         "jobTitle": "verkoper",
//         "role": "sales",
//         "organisations": [
//             "71c43fb6b5e7489ba2e59afc"
//         ]
//     },
//     "supplier": {
//         "_id": "c0685c3d85d942c6a0d8c68b",
//         "id": "c0685c3d85d942c6a0d8c68b",
//         "name": "supplier contract 1",
//         "email": "suppliercontract1@da.nl",
//         "jobTitle": "verkoper",
//         "role": "sales",
//         "organisations": [
//             "71c43fb6b5e7489ba2e59afc"
//         ]
//     },
//     "lastEditedDate" : new Date("2024-01-01"),
//     "customer": {
//         "name": "customer 1",
//         "jobTitle": "werk",
//         "address": "Blabla 42",
//         "postalCode": "5432AB",
//         "city": "Al Khali",
//         "country": "Klatch"
//     },
//     "dateOfSigning": new Date("2024-01-10"),
//     "locationOfSigning": "Lovensdijkstraat 63, Breda",
//     "responses": [
//         {
//             "field": "e42496f3962d47ad8ec48079",
//             "data": "blablabla"
//         }
//     ]
// };
// db.getCollection('templates').insertMany([
//     template1,
// ])

// // categories
// db.getCollection('categories').insertMany([
//     categoryA,
//     categoryB,
//     categoryC,
// ]);

// // fields
// db.getCollection('fields').insertMany([
//     field1,
// ]);

// db.getCollection('organisations').insertMany([
//     organisationNightWatch
// ]);

// db.getCollection('contracts').insertMany([
//     contractContract1,
// ]);




