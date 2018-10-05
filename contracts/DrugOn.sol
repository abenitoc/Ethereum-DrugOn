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
        uint prescription;
        uint expiringtime;
        uint time;
    }
    
    mapping (address => Doctor) public medics;
    mapping (address => Patient) public patients;


    function createPatient() public{
        require(patients[msg.sender].exists != true);
        patients[msg.sender].exists = true;
    }

    function createMedic() public {
        require(medics[msg.sender].exists != true);
        patients[msg.sender].exists = true;
    }

    function createPrescription(address patient, uint prescription, uint time, uint expiringtime) public {
        require(medics[msg.sender].exists == true);
        require(patients[patient].exists == true);
        patients[patient].prescriptions[patients[patient].prescriptions.length] = Prescription(msg.sender, prescription, time, expiringtime);
    }
    
    
    function recipesValid(address patient, uint recipe, uint actualDate) public view returns (bool){
        bool exists = false;
        if (patients[patient].exists == true && actualDate < patients[patient].prescriptions[recipe].expiringtime ){
            for(uint i = 0; i < patients[patient].prescriptions.length; i++){
                if(patients[patient].prescriptions[i].prescription == recipe ){
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
    
    function getPrescritionsById(address patient, uint index) public view returns (address from, uint prescription, uint expiringtime, uint time){
        require(patients[patient].exists == true);
        require(index >= 0);
        
        Prescription memory local_pres = patients[patient].prescriptions[index];
        return (local_pres.from, local_pres.prescription, local_pres.expiringtime, local_pres.time);
    }
    
    function getDoctor(address patient, uint recipe) public view returns (address){
        require(patients[patient].exists != true);
        require(patients[patient].prescriptions[recipe].prescription > 0);
        return patients[patient].prescriptions[recipe].from;
    }

}