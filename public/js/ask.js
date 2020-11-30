window.onload = () => {
  const textArea = document.getElementById("ask");
  textArea.addEventListener("input", () => {
    const contentLength = textArea.value.length;
    document.getElementById("char").innerHTML = `${200 - contentLength} char`;
  });
};
