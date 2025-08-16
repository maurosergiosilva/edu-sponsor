export const removeSpecialCharacters = (input: string) => {
  return input.replace(/\D/g, "");
};

export const formatPhone = (phone: string) => {
  let formattedValue = removeSpecialCharacters(phone);

  if (formattedValue.length === 11) {
    formattedValue = formattedValue.replace(
      /(\d{2})(\d{5})(\d{4})/,
      "($1) $2-$3"
    );
  } else if (formattedValue.length === 9) {
    formattedValue = formattedValue.replace(/(\d{5})(\d{4})/, "$1-$2");
  }

  return formattedValue;
};

export const formatDocument = (documentData: string) => {
  const document = removeSpecialCharacters(documentData);
  let formattedDocument = "";

  const isCpf = document.length <= 11;

  if (isCpf) {
    formattedDocument = document
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  } else {
    formattedDocument = document
      .replace(/(\d{2})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1/$2")
      .replace(/(\d{4})(\d{2})$/, "$1-$2");
  }

  return formattedDocument;
};

export const formatToBRL = (value: number) => {
  return value?.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
