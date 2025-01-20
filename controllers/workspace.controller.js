const Workspace = require('../models/workspace.model');
const { chatSession, codeGenSession } = require('../config/geminiConfig')
const addWorkspace = async (req, res) => {

    try {
        const newWorkspace = new Workspace({
            user_id: req.body.user_id,
            message: [
                req.body.message
            ],
            fileData: req.body.fileData,
        });
        await newWorkspace.save();
        return res.status(200).json({ success: true, message: 'Workspace added successfully', workspace: newWorkspace });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: 'Error adding workspace', error });
    }
}

const getMessageById = async (req, res) => {
    try {
        const workspace = await Workspace.findById(req.params.id);
        if (!workspace) {
            return res.status(404).json({ success: false, message: 'Workspace not found' });
        }
        return res.status(200).json({ success: true, message: 'Workspace found', workspace });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: 'Error getting workspace', error });
    }
}


// intregration in workspace AI model

const chatWithAI = async (req, res) => {
    const { prompt } = req.body;
    try {
        const response = await chatSession.sendMessage(prompt)
        console.log(response?.response?.candidates?.[0]?.content?.parts?.[0]?.text)
        return res.status(200).json({ success: true, message: 'Message sent successfully', response: response?.response?.candidates?.[0]?.content?.parts?.[0]?.text });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: 'Error sending message', error });

    }
}

const pushMessages = async (req, res) => {
    const { id } = req.query;
    const { content, role } = req.body;
    const obj = {
        role,
        content,
    }
    try {
        const updatedMessage = await Workspace.findByIdAndUpdate(id, {
            $push: {
                message: obj
            }
        }, { new: true });
        return res.status(200).json({ success: true, message: 'Message updated successfully', updatedMessage });
    } catch (err) {
        console.log(err)
        return res.status(500).json({ success: false, message: 'Error updating message', error: err });

    }

}

const generateCode = async (req, res) => {
    const prompt = req.body.prompt;
    try {
        const response = await codeGenSession.sendMessage(prompt)
        const result = response?.response?.candidates?.[0]?.content?.parts?.[0]?.text
        return res.status(200).json({ success: true, message: 'Message sent successfully', response: result })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: 'Error sending message', error });

    }
}
const updateGenerateCode = async (req, res) => {
    const { id } = req.query;
    const { fileData } = req.body;

    try {
        const findWorkSpace = await Workspace.findByIdAndUpdate(id, {
            $set: {
                fileData
            }
        })
        return res.status(200).json({ success: true, message: 'Message updated successfully', findWorkSpace });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: 'Error updating message', error });

    }
}

const findWorkSpaceById = async (req, res) => {
    const { id } = req.query;
    try {
        const findWorkSpace = await Workspace.findById(id);
        return res.status(200).json({ success: true, message: 'Message sent successfully', findWorkSpace });

    } catch (error) {
        console.log(error)
    }
}

const findWorkUserWise = async (req, res) => {
    const { id } = req.query;
    const userWorkSpaces = await Workspace.find({ user_id: id });
    console.log(userWorkSpaces)
    if (userWorkSpaces.length > 0) {
        const getFirstMessage = userWorkSpaces.map((item, index) => {
            return { workspaceId: item._id, message: item.message[0]?.content || null }
        })
        return res.status(200).json({ success: true, message: 'message found successfully', getFirstMessage });
    } else {
        return res.status(200).json({ success: true, message: 'message not found', userWorkSpaces: [] });
    }

}


const validatePrompt = async (req, res) => {
    let { prompt } = req.query;
    prompt = prompt.replace(/ /g, "")
    const AIMessage = `
    Analyze the following prompt and determine if it contains invalidating factors. Respond with "true" if the prompt contains ANY invalidating factors, or "false" if it does not.

    Invalidating factors include:
    1. Abusive, offensive, or unethical content
    2. Technically infeasible or impossible requests
    3. Meaningless terms (words/phrases without clear meaning or relevance)
    4. Non-implementable or overly simplistic statements that:
      - Lack actionable functionality (e.g., "dog color is black", "what is the weather in New York", "maggie recipe")
      - Don't describe any user interaction or purpose
      - Are purely factual statements without tool/application context
      - Lack critical details needed for implementation
    5. Vague or incomplete requirements that cannot be turned into a functional tool

    Valid prompts should:
    - Specify a tool or feature that is actionable and has a clear purpose.
    - Describe what the tool or feature should do, even if generally (e.g., "create a calculator", "design a to-do list").
    - Provide enough context or functionality that can be implemented.

    **Prompt to analyze**: "${prompt}"

    Respond only with "true" if there are any invalidating factors, or "false" if the prompt is valid.
    `;

    try {
        const response = await codeGenSession.sendMessage(AIMessage);

        // Check if the response is invalid (contains "true")
        const isInvalid = response?.response?.candidates?.[0]?.content?.parts?.[0]?.text.trim().toLowerCase() === "true";


        return res.status(200).json({ isValid: !isInvalid, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message, success: false });
    }
};



module.exports = {
    addWorkspace,
    getMessageById,
    chatWithAI,
    pushMessages,
    findWorkSpaceById,
    generateCode,
    updateGenerateCode,
    findWorkUserWise,
    validatePrompt
}