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
			createPatient()
		});


		// CREATE MEDICS
		$('#DrugOnite button#createMedic').click(function() {
			createMedic()
		});


		// CREATE PRECRIPTION
		$('#DrugOnite button#createPrescription').click(function() {
			createOnePrescription()
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

		$('#DrugOnite button#idDoctor').click(function() {
			isDoctorByAddress()			
		})
	});
});

var isDoctorByAddress = async () => {
	var addressDoctor = $('#DrugOnite input#inputIsDoctor').val();
	var existsDoctor = await DrugOn.methods.existsDoctor(addressDoctor).call()
	console.log(existsDoctor)	
}

var createPatient = async () => {
	var address = $('#DrugOnite input#inputPatient').val();
	// set up our contract method with the input values from the form
	const createPatient = DrugOn.methods.createPatient();
	const gasEstimate = await createPatient.estimateGas({ from: address, gas: 100000 });
	const result = await createPatient.send({ from: address,  gas: gasEstimate + 1000 });

	$('#DrugOnite .Patients h4').after('<p>'+address+'</p>');
}

var createMedic = async () => {
	var address = $('#DrugOnite input#inputMedic').val();

	// set up our contract method with the input values from the form
	const createMedic = DrugOn.methods.createMedic();
	const gasEstimate = await createMedic.estimateGas({ from: address, gas: 100000 });
	const result = await createMedic.send({ from: address,  gas: gasEstimate + 1000 });
	
	$('#DrugOnite .Medics h4').after('<p>'+address+'</p>');

}

var createOnePrescription = async () => {

	var addressPatient = $('#DrugOnite input#patientToPrescript').val();
	var addressMedic = $('#DrugOnite input#medicWhoPrescrip').val();
	var idPrescription = $('#DrugOnite input#idPrescription').val();
	var expiringtime = Date.now();
	var time = expiringtime + 1000*60*60*24*60;

	console.log(addressPatient)
	console.log(addressMedic)
	console.log(idPrescription)
	console.log(expiringtime)
	console.log(time)


	// set up our contract method with the input values from the form
	const createPrescription = DrugOn.methods.createPrescription(addressPatient, parseInt(idPrescription), expiringtime, time);
	const gasEstimate = await createPrescription.estimateGas({ from: addressMedic, gas: 100000 });
	const result = await createPrescription.send({ from: addressMedic,  gas: gasEstimate + 1000 });

	$('#DrugOnite .listPrescriptions h4').after('<p>'+idPrescription+'</p>');
}