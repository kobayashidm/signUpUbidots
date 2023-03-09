function togglePassword() {
  var x = document.getElementById("password");
  if (x.type === "password") {
    x.type = "text";
  } else {
    x.type = "password";
  }
}

async function registration() {
  const nome = document.getElementById("nome").value;
  const sobrenome = document.getElementById("sobrenome").value;
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const passwordConfirm = document.getElementById("passwordConfirm").value;
  const mac = document.getElementById("mac").value;
  const deviceName = document.getElementById("deviceName").value;
  const organization = document.getElementById("organization").value;

  const configRegistration = {
    headers: {
      "Content-Type": "application/json",
      "X-Auth-Token": "BBFF-V9KsWRKJ3rlNAvcvyh1qbzFaZcdLTP",
    },
  };

  const urlNewUser = "https://industrial.api.ubidots.com/api/v2.0/users/";

  const dataNewUser = {
    username: `${username}`,
    firstName: `${nome}`,
    lastName: `${sobrenome}`,
    password: `${password}`,
    email: `${email}`,
    isActive: true,
  };

  const urlNewOrganization =
    "https://industrial.api.ubidots.com/api/v2.0/organizations/";

  const dataNewOrganization = {
    label: `${organization}`,
    name: `${organization}`,
  };

  const urlNewDevice =
    "https://industrial.api.ubidots.com/api/v2.0/devices/_/provision/?type=mienergy_home";

  const urlDevice = "https://industrial.api.ubidots.com/api/v2.0/devices/";

  const dataNewDevice = {
    device: { label: `${mac}`, name: `${deviceName}` },
  };

  if (nome === "" || nome.length == 0) {
    alert("Preencha o campo nome");
    return;
  }
  if (sobrenome === "" || sobrenome.length == 0) {
    alert("Preencha o campo sobrenome");
    return;
  }

  if (username === "" || username.length == 0) {
    alert("Preencha o campo username");
    return;
  }
  if (email === "" || email.length == 0) {
    alert("Preencha o campo email");
    return;
  }
  if (password === "" || password.length == 0) {
    alert("Preencha o campo password");
    return;
  }
  if (mac === "" || mac.length == 0) {
    alert("Preencha o campo mac");
    return;
  }
  if (deviceName === "" || deviceName.length == 0) {
    alert("Preencha o campo deviceName");
    return;
  }
  if (organization === "" || organization.length == 0) {
    alert("Preencha o campo organization");
    return;
  }
  if (passwordConfirm !== password) {
    alert("As senhas não conferem");
    return;
  }

  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    console.log("email válido");
  } else {
    alert("Email inválido");
    return;
  }

  var deviceId = "";
  var organizationId = "";
  var userId = "";

  var userExists = false;
  var organizationExists = false;
  var deviceExists = false;
  document.getElementById("submit").disabled = true;
  try {
    const getUser = await axios.get(
      urlNewUser + "~" + `${username}`,
      configRegistration
    );
    console.log(getUser);
    userExists = true;
  } catch (error) {
    console.log(error);
    console.log("status do erro: " + error.response.status);
  }
  try {
    const getOrganization = await axios.get(
      urlNewOrganization + "~" + `${organization}`,
      configRegistration
    );
    console.log(getOrganization);
    organizationExists = true;
  } catch (error) {
    console.log(error);
    console.log("status do erro: " + error.response.status);
  }
  try {
    const getDevice = await axios.get(
      urlDevice + "~" + `${deviceName}`,
      configRegistration
    );
    console.log(getDevice);
    deviceExists = true;
  } catch (error) {
    console.log(error);
    console.log("status do erro: " + error.response.status);
  }
  if (!userExists && !organizationExists && !deviceExists) {
    try {
      const postUserRegistration = await axios.post(
        urlNewUser,
        dataNewUser,
        configRegistration
      );
      console.log(postUserRegistration);
      userId = postUserRegistration.data.id;
    } catch (error) {
      console.log(error);
      if(response.data.detail.non_field_errors === "Email or username is already taken."){
        alert("E-mail já cadastrado");
        return;
      }
    }
    try {
      const postOrganizationRegistration = await axios.post(
        urlNewOrganization,
        dataNewOrganization,
        configRegistration
      );
      console.log(postOrganizationRegistration);
      organizationId = postOrganizationRegistration.data.id;
    } catch (error) {
      console.log(error);
    }
    try {
      const postDeviceRegistration = await axios.post(
        urlNewDevice,
        dataNewDevice,
        configRegistration
      );
      console.log(postDeviceRegistration);
      deviceId = postDeviceRegistration.data.device.id;
    } catch (error) {
      console.log(error);
    }
    try {
      const postAssignDevice = await axios.post(
        "https://industrial.api.ubidots.com/api/v2.0/organizations/" +
          `${organizationId}` +
          "/_/assign_devices/",
        [{ id: `${deviceId}` }],
        configRegistration
      );
      console.log(postAssignDevice);
    } catch (error) {
      console.log(error);
    }
    try {
      const postAssignUser = await axios.post(
        "https://industrial.api.ubidots.com/api/v2.0/users/" +
          `${userId}` +
          "/_/assign_organizations",
        [{ label: `${organization}`, role: "usuario-padrao" }],
        configRegistration
      );
      console.log(postAssignUser);
    } catch (error) {
      console.log(error);
    }
    alert("Cadastro realizado com sucesso");
    document.getElementById("submit").disabled = false;
    
  }
  else if(userExists){
    alert("Já existe um usuário com esse nome");

  }
  else if(organizationExists)
  {
    alert("Já existe uma organização com esse nome");

  }
  else if(deviceExists){
    alert("Já existe um dispositivo com esse nome");
  }
  document.getElementById("submit").disabled = false;
  
  document.getElementById("nome").value = "";
  document.getElementById("sobrenome").value = "";
  document.getElementById("username").value= "";
  document.getElementById("email").value="";
  document.getElementById("password").value = "";
  document.getElementById("passwordConfirm").value = "";
  document.getElementById("mac").value = "";
  document.getElementById("deviceName").value = "";
  document.getElementById("organization").value = "";

}
