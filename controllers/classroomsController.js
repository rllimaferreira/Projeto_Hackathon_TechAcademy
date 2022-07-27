const Classroom = require('../models/classroomModel');
const ClassroomService = require("../services/classroomsService");
const UserService = require("../services/usersService");
const TeamService = require("../services/teamsService");
const MissionService = require("../services/missionService");
const RewardService = require("../services/rewardsService");

exports.index = async (req, res, next) => {
    try{
        const classrooms = await new ClassroomService().index();
        res.render("classrooms/index", {classrooms: classrooms});
    }catch(error){
        res.redirect("/");
    }
};

exports.new = async (req, res, next) => {
    res.render("classrooms/new");
};

exports.create = async(req, res, next) => {

    try{
        const classroom = await new ClassroomService().create(req.body);
        const classrooms = await new UserService().createProfile(parseInt(classroom.id), req.user.id, "Teacher");
        
        req.flash(
            'success_msg','Turma cadastrada com sucesso!'
           );
        res.render("classrooms/dashboard", {classrooms: classrooms});
    }catch(error){
        if (error.errors){  
            res.render("classrooms/new", {name: error.errors['name'], 
                description: error.errors['description'], 
                errors: error.errors['errors'] });} 
        else{
            res.redirect("/classrooms");
        } 
    }
};

exports.show = async (req, res, next) => {
    try{
        const classroom = await new ClassroomService().show(req.params.id);
        console.log(classroom.id)
        const teams = await new TeamService().listTeamsByClassrooms(classroom.id);
        const missions = await new MissionService().listMissionsByClassrooms(classroom.id);
        const rewards = await new RewardService().listRewardsByClassrooms(classroom.id);
        console.log(teams)
        console.log(missions)
        res.render("classrooms/show", {classroom: classroom, teams: teams, missions: missions, rewards: rewards} );
    }catch(error){
        res.redirect("/classrooms");
    }
};

exports.edit = async (req, res, next) => {
    try{
        const classroom = await new ClassroomService().edit(parseInt(req.params.id));
        res.render("classrooms/edit", {classroom: classroom});
    }catch(error){
        res.redirect("/classrooms");
    }
};

exports.update = async(req, res, next) => {
    
    try{
        const classroom = await new ClassroomService().update(req.body);
        res.render("classrooms/show", {classroom: classroom});
    }catch(error){
        if (error.errors){        
            res.render("classrooms/edit", {id: error.errors['id'], 
                name: error.errors['name'], 
                description: error.errors['description'], 
                errors: error.errors['errors'] })}    
        else{
            res.redirect("/classrooms");
        }    
    }
};

exports.dashboardClassrooms = async function (req, res, next) {
    try{
        
        const classrooms = await new ClassroomService().findByUser(req.user.id);
        console.log(classrooms)
        res.render("classrooms/dashboard", {classrooms: classrooms});
    }catch(error){
        res.render("classrooms/dashboard", {classrooms: []});
    }
};
