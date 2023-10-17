import request from 'supertest';
import { app } from '../../app';


it('returns a 201 on successfull signup', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);
});


it('returns a 400 with an invalid email', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'testtest.com',
            password: 'password'
        })
        .expect(400);
});

it('returns a 400 with an invalid password', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'testtest.com',
            password: 'p'
        })
        .expect(400);
});

it('returns a 400 with missing email and password', async () => {

    await request(app)
        .post('/api/users/signup')
        .send({
            email: "test@test.com"
        })
        .expect(400);

    return request(app)
        .post('/api/users/signup')
        .send({
            password: "wassupMacha"
        })
        .expect(400);
});

it('dissallows duplicate email', async () => {

    await request(app)
        .post('/api/users/signup')
        .send({
            email: "test@test.com",
            password: "wassupMacha",
        })
        .expect(201);

    await request(app)
        .post('/api/users/signup')
        .send({
            email: "test@test.com",
            password: "wassupMacha",
        })
        .expect(400);
});


it('sets a cookie after successfull sigup', async () => {
    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email: "test@test.com",
            password: "wassupMacha",
        })
        .expect(201);

    // the .get is a response method that helps us to look up the the headers
    // we will have to mention the header we are looking for in the param !!
    expect(response.get('Set-Cookie')).toBeDefined();

});