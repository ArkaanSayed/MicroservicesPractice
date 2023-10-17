import mongoose from "mongoose";
import { Password } from "../services/password";


// A User model is a User table (sql shiz)
// A User doc is a User in the user table / A row in the table (sql shiz)

// An interface that describes the properties
// that are required to create a new user

interface UserAttrs {
    email: string;
    password: string;
}

// An interface that describes the properties
// That a user model has
interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc
}

// An interface that describes the properties
// that a User Document has
// When we extend the Document class of mongoose 
// The child will have all the memebers and member functions
// But we only allow the use of two fields that is email and password.
interface UserDoc extends mongoose.Document {
    email: string,
    password: string,
    // createdAt: string,
    // updatedAt: string,
}



const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.password;
            delete ret.__v;
        }
    }
});

// Using preSave hook, which will execute a function before it saves to the db
// Also cannot use arrow function over here because we need to use the this keyword
// this will point to the current User Doc !!
// If we use arrow function this wont be pointing to the Doc but instead to the entire file context !!
userSchema.pre('save', async function (done) {
    if (this.isModified('password')) {
        const hashed = await Password.toHash(this.get('password'));
        this.set('password', hashed);
    }
    done();
});

// Defining our own method as a property to our Schema !!
userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
}

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);


export { User }