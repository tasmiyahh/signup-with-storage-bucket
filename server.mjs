import express, { request } from "express"
import cors from "cors"
import mongoose from 'mongoose';
import fs from 'fs';
import admin from "firebase-admin";
import { stringToHash } from "bcrypt-inzi";

// https://firebase.google.com/docs/storage/admin/start


var serviceAccount = { //ye hum apna laye h storagebucket k siide pe project seting me service account generate krk
    
        "type": "service_account",
        "project_id": "login-with-bucket",
        "private_key_id": "7cf9fc2ba85b98e8e677e3a5c113ecc293e2df8a",
        "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCm5KAYzRMfwrkD\nJd44Du0InFxIijSbV5MzkLfiU4PSg+OLVu/dlh21qH4sptEyWYJT0p90PNeE2q2e\nVHUouCpNWvfTkziHTzRwW5Pz3325/YvFYx57aIWFoGrCt0pzwTOhCg979mrXn4On\nmkK6x7OssyeoILuRvkrMmfaqrMwEQ8jqZQhwiSCk4SpIwQndMQoO3XdyyzleIPbG\nu3Kcl15kYtyphvYqURqkiEE9g2whR8mT9XXXu5K3+jnKUpdITyYRGCpo7FE13iQI\nbmkuK5RV37DZ6korYAFtfksYeHtmEh1OyQsca9adveo3POjd8/PKwSznnqXMHKhI\nUtsN3WWRAgMBAAECggEACeneXnDGljoz8R1djI8K6po2o161yqU2Zs+Ns7uOItnv\noRgXQB5t2fvF8G8xkaQGYUYrb306eF9gxS0bR0GezijlXB+UcdmtKdAvywKLYmoe\npIlLbw1VspsFgnberN706xfI1Q5NeQzWNkVMGdIZYLyk4jhdCfaPtQT/hXKFnSpk\n0TLRn74fVKytvBFvu3nkjMsMxK7XQK1lHJfcjhjogPm5xlt7Xkk7rTzhLWO95elw\nZdGI3+GLLBfYYIkeshjqmrW+kymQa6eGiqhfhXGA85hwTmwNNk6NKUsm2Iyp8UJq\nbgmopPAVy9kHomqaQfMJR52KRZwTAOj04/IWhitRIQKBgQDPYw/S9FItfHpCYOt4\nRsZhtpd7e2WlkjUIsj9WQPvDhpSgeolEarpFShyWNiWI8KR2WBx6ai2uhkHqn4pG\nyDPlAoRhqNf/JL14WHCShpqJGxk1pWpKtbUe542hnAL6waNJJpP75uiVuwPmAmUk\nhDvhC7DMRWyvZpg/2ZUQwVuJcQKBgQDOA5gVCndhtsOG2RawPdu57XKedfQCfop/\n7bJCMoCAQwQQVzxZT+v+xYtRDR4r8YXqA1O9TXGtQlPNDVjITRG56FGm4bsvfdH/\nEDduvbF2WKZjeY60/dO5VruF1+Gf/51SLl/qMSt2+k4KHKb2J/5IIBewOOP1nd9E\nxsd1fhSOIQKBgEHYagXInO7kPs0kiJ6/me0cVCxYmYVgToZcUc/JAiaqbDYnsb2P\nRWUKitkGiBRak10fzKrxW1+2MOeVkAm5NwDXM8DuIuZXe/Dh45wiMJ6ng/GMe5sM\n5lzRmB5fsnJ7WKS5IvMv9VjU7//vcr2NXpWtaIzy3fcy09Qx+SpAuheBAoGAMWS5\nNOpCf0ITlSQ9hVn/cY+VuJptO5/dUxjJcYesOZRXyBcyV/OKkJYKdg9gGYcZ5WaQ\n0EVeKP1LHFHD5Jpd0qX51bovaA6Rp8bak4mVn9tXYWhGp+xns/swkMGWzga6UHbf\n9kV9t1QCG/iMq14hYGeZZl3tgfktC89hCTGGeiECgYBA8ugFbrrcztoMFsCGvkOd\nUAfUMIpM3YeK8+t2YCNSQdCSc2cnS8bddHu/q6IQK8kJ8C/pWJHiHjvfrdmb8nMh\nbETY+AIR4UBdDBt0mpG3dUiqPjiKK2wnb2WZEXpH8tIaAQUjqdKfU/afh2U8NuVj\ngeBJt2mab/oSFnmBG+5xew==\n-----END PRIVATE KEY-----\n",
        "client_email": "firebase-adminsdk-pkw61@login-with-bucket.iam.gserviceaccount.com",
        "client_id": "109712106267957774145",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-pkw61%40login-with-bucket.iam.gserviceaccount.com"
      
         
}
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://login-with-bucket.firebaseio.com" //apni project ki id lgo
});
const bucket = admin.storage().bucket("gs://login-with-bucket.appspot.com");





//==============================================
import multer from 'multer';
const storageConfig = multer.diskStorage({ // https://www.npmjs.com/package/multer#diskstorage
    destination: './uploads/',
    filename: function (req, file, cb) {

        console.log("mul-file: ", file);
        cb(null, `${new Date().getTime()}-${file.originalname}`)
    }
})
var upload = multer({ storage: storageConfig })

//==============================================





const port = process.env.PORT || 5001;


const app = express();
app.use(express.json()); // parsing body


app.use(cors(
   
));

const userSchema = new mongoose.Schema({

    name: { type: String },
    email: { type: String, required: true },
    password: { type: String, required: true },
    profilePicture: { type: String, required: true },

    createdOn: { type: Date, default: Date.now },
});
const userModel = mongoose.model('Users', userSchema);



app.post("/signup", upload.any(), (req, res) => {

    let body = req.body;

    // console.log("body: ", body);
    // console.log("body: ", body.name);
    // console.log("body: ", body.email);
    // console.log("body: ", body.password);

    console.log("file: ", req.files[0]);

    if (!body.name
        || !body.email
        || !body.password
    ) {
        res.status(400).send(
            `required fields missing, request example: 
                {
                    "name": "John",
                    "email": "abc@abc.com",
                    "password": "12345"
                }`
        );
        return;
    }


    // https://googleapis.dev/nodejs/storage/latest/Bucket.html#upload-examples
    bucket.upload(
        req.files[0].path,
        {
            destination: `uploads/${req.files[0].filename}`, // give destination name if you want to give a certain name to file in bucket, include date to make name unique otherwise it will replace previous file with the same name
        },
        function (err, file, apiResponse) {
            if (!err) {
                // console.log("api resp: ", apiResponse);

                // https://googleapis.dev/nodejs/storage/latest/Bucket.html#getSignedUrl
                file.getSignedUrl({
                    action: 'read',
                    expires: '03-09-2491'
                }).then((urlData, err) => {
                    if (!err) {
                        console.log("public downloadable url: ", urlData[0]) // this is public downloadable url 

                        // delete file from folder before sending response back to client (optional but recommended)
                        // optional because it is gonna delete automatically sooner or later
                        // recommended because you may run out of space if you dont do so, and if your files are sensitive it is simply not safe in server folder
                        try {
                            fs.unlinkSync(req.files[0].path)
                            //file removed
                        } catch (err) {
                            console.error(err)
                        }


                        // check if user already exist // query email user
                        userModel.findOne({ email: body.email }, (err, user) => {
                            if (!err) {
                                console.log("user: ", user);

                                if (user) { // user already exist
                                    console.log("user already exist: ", user);
                                    res.status(400).send({ message: "user already exist,, please try a different email" });
                                    return;

                                } else { // user not already exist

                                    stringToHash(body.password).then(hashString => {

                                        userModel.create({
                                            name: body.name,
                                            email: body.email.toLowerCase(),
                                            password: hashString,
                                            profilePicture: urlData[0]
                                        },
                                            (err, result) => {
                                                if (!err) {
                                                    console.log("data saved: ", result);
                                                    res.status(201).send({
                                                        message: "user is created",
                                                        data: {
                                                            name: body.name,
                                                            email: body.email.toLowerCase(),
                                                            profilePicture: urlData[0]
                                                        }
                                                    });
                                                } else {
                                                    console.log("db error: ", err);
                                                    res.status(500).send({ message: "internal server error" });
                                                }
                                            });
                                    })

                                }
                            } else {
                                console.log("db error: ", err);
                                res.status(500).send({ message: "db error in query" });
                                return;
                            }
                        })


                    }
                })
            } else {
                console.log("err: ", err)
                res.status(500).send();
            }
        });








});


app.get("/users", async (req, res) => {
    try {
        let users = await userModel.find({}).exec();
        console.log("all user : ", users);

        res.send({
            message: "all users",
            data: users
        });
    } catch (error) {
        res.status(500).send({
            message: "failed to get product"
        });
    }
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})










let dbURI = process.env.dbURI || 'mongodb+srv://tasmiyah:web@cluster0.cj82tmo.mongodb.net/storage?retryWrites=true&w=majority';
mongoose.connect(dbURI);

////////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on('connected', function () {//connected
    console.log("Mongoose is connected");
});

mongoose.connection.on('disconnected', function () {//disconnected
    console.log("Mongoose is disconnected");
    process.exit(1);
});

mongoose.connection.on('error', function (err) {//any error
    console.log('Mongoose connection error: ', err);
    process.exit(1);
});

process.on('SIGINT', function () {/////this function will run jst before app is closing
    console.log("app is terminating");
    mongoose.connection.close(function () {
        console.log('Mongoose default connection closed');
        process.exit(0);
    });
});