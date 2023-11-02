const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index'); // Import your Express app
const expect = chai.expect;

chai.use(chaiHttp);

describe('Movie Ticket Booking API', () => {
//   // Test case for a successful booking
  it('should successfully book a ticket', (done) => {
    chai
      .request(app)
      .post('/api/booking')
      .send({ movie: 'Sample Movie', seats: { A1: 2 }, slot: 'Morning' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.movie[0]).to.equal( 'Sample Movie' );
        expect(res.body.slot[0]).to.equal('Morning');
        expect(res.body.seats.A1[0]).to.equal(2)
        
        done();
      });
  });

  //Test case for invalid input
  it('should handle invalid input', (done) => {
    chai
      .request(app)
      .post('/api/booking')
      .send({ movie: "", seats: { A1: 2 }, slot: 'Evening' }) // movie and slot should not be empty and  atleast select one seat
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });

  // // Test case for seat availability conflict (for existing  data booking)
  it('should handle seat availability conflict', (done) => {
    chai
      .request(app)
      .post('/api/booking')
      .send({ movie: 'Sample Movie', seats: { A1: 1 }, slot: 'Morning' })
      .end(() => {
        chai
          .request(app)
          .post('/api/booking')
          .send({ movie: 'Sample Movie', seats: { A1: 1 }, slot: 'Morning' })
          .end((err, res) => {
            expect(res).to.have.status(409);
            done();
          });
      });
  });

  //Test case for retrieving the last booking
  it('should retrieve the last booking', (done) => {
    chai
      .request(app)
      .get('/api/booking')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
  
        // Add assertions for the retrieved booking data
        const bookingData = res.body;

        
        // bookingData={ movie:['movie_name'],seats:{}, slot:['slot_name']}

        // Ensure that the retrieved booking data contains the expected properties
        expect(bookingData).to.have.property('movie');
        expect(bookingData).to.have.property('seats');
        expect(bookingData).to.have.property('slot');
  
        // Add more specific assertions based on your data structure
        // For example, if you expect 'movie' to be a string:
        expect(bookingData.movie).to.be.a('array'); 
        expect(bookingData.movie[0]).to.be.a('string');
  
        // If you expect 'seats' to be an object:
        expect(bookingData.seats).to.be.an('object');
  
        // If you expect 'slot' to be a string:
        expect(bookingData.slot).to.be.a('array');
        expect(bookingData.slot[0]).to.be.a('string');
  
        //check specific values if we have predefined data
        // For example, if we know the expected movie name, slot, or seats:
        // expect(bookingData.movie).to.equal('Expected Movie Name');
        // expect(bookingData.slot).to.equal('Expected Slot');
        // expect(bookingData.seats).to.deep.equal({ A1: 2, A2: 0 });
  
        done();
      });
  });

  // // Test case for no previous bookings found
  // it('should handle no previous bookings found', (done) => {
  //   chai
  //     .request(app)
  //     .get('/api/booking')
  //     .end((err, res) => {
  //       expect(res).to.have.status(404);
  //       expect(res.body).to.be.an('object');
  //       expect(res.body.message).to.equal('No previous booking found');
  //       done();
  //     });
  // });

  // more test cases for error handling, 
});
