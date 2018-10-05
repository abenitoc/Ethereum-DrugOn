import $ from 'jquery';
import EmbarkJS from 'Embark/EmbarkJS';
import DrugOn from 'Embark/contracts/DrugOn';

$(document).ready(function() {
	EmbarkJS.onReady((error) => {
		if (error) {
			console.error('Error while connecting to web3', error);
			return;
		}

		web3.eth.getAccounts(function(err, accounts) {
			for (var i = 0; i < accounts.length; i++) {
				$('#DrugOnite .result').append('<p>'+accounts[i]+'</p>');
			}
		})


		// CREATE ADDRESS
		$('#DrugOnite button#createAddress').click(function() {
			web3.eth.personal.newAccount('MyPassword', function(err, account) {
				$('#DrugOnite .result').append('<p>'+account+'</p>');
			})
		});


		// CREATE PATIENTS
		$('#DrugOnite button#createPatient').click(function() {
			try {
				var address = $('#DrugOnite input#inputPatient').val();
	      
				// set up our contract method with the input values from the form
				const createPatient = DrugOn.methods.createPatient();

				web3.eth.personal.unlockAccount(address,"MyPassword", 15000, function(err, result) {
					// get a gas estimate before sending the transaction
					createPatient.estimateGas({ from: address, gas: 1000000 },function(err, gasEstimate) {
						if (err) {
							console.log('estimation error ', err)
						} else {
							console.log(gasEstimate)
							createPatient.send({ from: address,  gas: gasEstimate + 1000 },function(result) {
								console.log(result)
								// check result status. if status is false or '0x0', show user the tx details to debug error
								if (result.status && !Boolean(result.status.toString().replace('0x', ''))) { // possible result values: '0x0', '0x1', or false, true
									return console.log('Error executing transaction, transaction details: ' + JSON.stringify(result));
								} else {
									$('#DrugOnite .Patients h4').after('<p>'+address+'</p>');
								}
							});
						}
					});
				})

		    } catch (err) {
		    	console.log("try catch error ", err)
		    };
		});


		// CREATE MEDICS
		$('#DrugOnite button#createMedic').click(function() {
			try {
				var address = $('#DrugOnite input#inputMedic').val();
	      
				// set up our contract method with the input values from the form
				const createMedic = DrugOn.methods.createMedic();

				web3.eth.personal.unlockAccount(address,"MyPassword", 15000, function(err, result) {
					// get a gas estimate before sending the transaction
					createMedic.estimateGas({ from: address, gas: 10000000000 },function(err, gasEstimate) {
						if (err) {
							console.log('estimation error ', err)
						} else {
							console.log(gasEstimate)
							createMedic.send({ from: address,  gas: gasEstimate + 1000 },function(result) {
								// check result status. if status is false or '0x0', show user the tx details to debug error
								if (result.status && !Boolean(result.status.toString().replace('0x', ''))) { // possible result values: '0x0', '0x1', or false, true
									return console.log('Error executing transaction, transaction details: ' + JSON.stringify(result));
								} else {
									$('#DrugOnite .Medics h4').after('<p>'+address+'</p>');
								}
							});
						}
					});
				})

		    } catch (err) {
		    	console.log("try catch error ", err)
		    };
		});


		// CREATE PRECRIPTION
		$('#DrugOnite button#createPrescription').click(function() {
			try {

				var addressPatient = $('#DrugOnite input#patientToPrescript').val();
				var addressMedic = $('#DrugOnite input#medicWhoPrescrip').val();
				var idPrescription = $('#DrugOnite input#idPrescription').val();
	      		var expiringtime = Date.now()
	      		var time = expiringtime

				// set up our contract method with the input values from the form
				const createPrescription = DrugOn.methods.createPrescription(addressPatient, idPrescription, expiringtime, time);

				web3.eth.personal.unlockAccount(addressMedic,"MyPassword", 15000, function(err, result) {
					// get a gas estimate before sending the transaction
					createPrescription.estimateGas({ from: addressMedic, gas: 10000000000 },function(err, gasEstimate) {
						if (err) {
							console.log('estimation error ', err)
						} else {
							console.log(gasEstimate)
							createPrescription.send({ from: addressMedic,  gas: gasEstimate + 1000 },function(result) {
								// check result status. if status is false or '0x0', show user the tx details to debug error
								if (result.status && !Boolean(result.status.toString().replace('0x', ''))) { // possible result values: '0x0', '0x1', or false, true
									return console.log('Error executing transaction, transaction details: ' + JSON.stringify(result));
								} else {
									$('#DrugOnite .listPrescriptions h4').after('<p>'+idPrescription+'</p>');
								}
							});
						}
					});
				})

		    } catch (err) {
		    	console.log("try catch error ", err)
		    };
		});




		$('#DrugOnite button#obtainDoctors').click(function() {
			var get_request = $.get({
                url: 'http://localhost:5000/doctors'
            })
     
            get_request.done((response) => {
            	for (var i =0; i < response.doctors.length; i++) {
            		$('#DrugOnite .doctors_api h4').after('<p>'+response.doctors[i]+'</p>');	
            	}
                
            });

            get_request.fail((response) => {
                console.log(response)
            })
		});
	});
});