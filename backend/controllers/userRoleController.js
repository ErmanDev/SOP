const UserRoles = require('../models/user_roles');



exports.getAllRoles = async (req, res) => {
    try {
        const roles = await UserRoles.findAll();
        res.status(200).json(roles);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving roles", error });
    }
};


exports.getRoleById = async (req, res) => {
    try {
        const role = await UserRoles.findByPk(req.params.id);
        if (!role) return res.status(404).json({ message: "Role not found" });
        res.status(200).json(role);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving role", error });
    }
};


exports.createRole = async (req, res) => {
    try {
        const newRole = await UserRoles.create(req.body);
        res.status(201).json(newRole);
    } catch (error) {
        res.status(500).json({ message: "Error creating role", error });
    }
};


exports.updateRole = async (req, res) => {
    try {
        const role = await UserRoles.findByPk(req.params.id);
        if (!role) return res.status(404).json({ message: "Role not found" });

        await role.update(req.body);
        res.status(200).json(role);
    } catch (error) {
        res.status(500).json({ message: "Error updating role", error });
    }
};

// Delete a role
exports.deleteRole = async (req, res) => {
    try {
        const role = await UserRoles.findByPk(req.params.id);
        if (!role) return res.status(404).json({ message: "Role not found" });

        await role.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: "Error deleting role", error });
    }
};
