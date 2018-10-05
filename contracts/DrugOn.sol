pragma solidity ^0.4.24;

contract DrugOn {

    struct Doctor {
        bool exists;
    }

    struct Patient {
        bool exists;
        Prescription[] prescriptions;
    }

    struct Prescription{
        address from;
        uint idPrescription;
        uint expiringtime;
        uint time;
    }
    
    mapping (address => Doctor) public medics;
    mapping (address => Patient) public patients;


    function createPatient() public{
        require(patients[msg.sender].exists != true);
        require(medics[msg.sender].exists != true);
        patients[msg.sender].exists = true;
    }

    function createMedic() public {
        require(patients[msg.sender].exists != true);
        require(medics[msg.sender].exists != true);
        medics[msg.sender].exists = true;
    }

    function createPrescription(address patient, uint idPrescription, uint time, uint expiringtime) public {
        require(medics[msg.sender].exists == true);
        require(patients[patient].exists == true);
        Patient storage pat = patients[patient];
        Prescription memory p1 = Prescription(msg.sender, idPrescription, expiringtime, time);
        pat.prescriptions.push(p1);
    }
    
    
    function recipesValid(address patient, uint recipe, uint actualDate) public view returns (bool){
        bool exists = false;
        if (patients[patient].exists == true ){
            for(uint i = 0; i < patients[patient].prescriptions.length; i++){
                if(patients[patient].prescriptions[i].idPrescription == recipe && actualDate < patients[patient].prescriptions[i].expiringtime){
                    exists = true;
                }
            }
        }
        return exists;
    }
    
    function getPrescritionsCount(address patient) public view returns (uint){
        require(patients[patient].exists == true);
        return patients[patient].prescriptions.length;
    }
    
    function getPrescritionsById(address patient, uint index) public view returns (address from, uint idPrescription, uint expiringtime, uint time){
        require(patients[patient].exists == true);
        require(index >= 0);
        
        Prescription memory local_pres = patients[patient].prescriptions[index];
        return (local_pres.from, local_pres.idPrescription, local_pres.expiringtime, local_pres.time);
    }
    
    function getDoctor(address patient, uint recipeId) public view returns (address){
        require(patients[patient].exists == true);
        require(patients[patient].prescriptions[recipeId].time > 0);
        return patients[patient].prescriptions[recipeId].from;
    }

    function existsDoctor(address doctor) public view returns (bool) {
        return medics[doctor].exists;
    }

}