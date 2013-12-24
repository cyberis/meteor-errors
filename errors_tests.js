Tinytest.add("Errors collection works", function(test) {
  // expected initial condition
  test.equal(Errors.collection.find({}).count(), 0);
  
  // add an error and test for new condition
  Errors.throw('A new error!');
  test.equal(Errors.collection.find({}).count(), 1);
  
  // return the collection to the initial condition
  Errors.collection.remove({});
});

Tinytest.addAsync("Errors template works", function(test, done) {
  // add an error to the collection
  Errors.throw('A new error!');
  test.equal(Errors.collection.find({seen: false}).count(), 1);
  
  // render the template
  OnscreenDiv(Spark.render(function() {
    return Template.meteorErrors();
  }));
  
  // wait a few milliseconds
  Meteor.setTimeout(function() {
    test.equal(Errors.collection.find({seen: false}).count(), 0); // that error should be marked as seen
    test.equal(Errors.collection.find({}).count(), 1); // the error should still be in the collection awaiting purge
    
    // purge the error and make sure it is no longer there
    Errors.clearSeen();
    test.equal(Errors.collection.find({seen: true}).count(), 0);
    
    // only do this once
    done();
  }, 500);
});
  