import Swal from "sweetalert2";

export const showSuccessAlert = (message: string) => {
  Swal.fire({
    title: `<span class="fw-bold m-0 p-0">Success</span>`,
    html: `
      <p class="text-muted  m-0 p-0 pb-3">
        ${message}
      </p>
    `,
    iconHtml: `<i class="bi bi-check-circle-fill" style="color:#00c851; font-size:60px;"></i>`,
    confirmButtonText: "OK",
    buttonsStyling: false,
    customClass: {
      popup: "rounded-5 shadow-lg py-4 border-0",
      confirmButton: "btn btn-success btn-success2 swal-btn py-2 fw-semibold",
      closeButton: "position-absolute",
      icon: "border-0 mt-0",
      title: "p-0 m-0",
      actions: "p-0 m-0",
    },
    width: "350px",
    didRender: () => {
      const btn = document.querySelector(".swal2-confirm") as HTMLElement;
      if (btn) {
        btn.setAttribute(
          "style",
          `
            width: 250px;
            background-color: #00c851;
            color: white;
            border-radius: 5px;
            padding: 10px 0;
            font-weight: 600;
            border: none;
            font-size: 15px;
            transition: background-color 0.3s ease, transform 0.2s ease;
          `
        );

        btn.addEventListener("mouseenter", () => {
          btn.style.backgroundColor = "#00c851";
          btn.style.transform = "scale(1.03)";
        });
        btn.addEventListener("mouseleave", () => {
          btn.style.backgroundColor = "#00c851";
          btn.style.transform = "scale(1)";
        });
      }
    },
  });
};

export const showFailedAlert = (message: string) => {
  Swal.fire({
    title: `<span class="fw-bold m-0 p-0">Failed</span>`,
    html: `
      <p class="text-muted  m-0 p-0 pb-3">
        ${message}
      </p>
    `,
    iconHtml: `<i class="bi bi-x-circle-fill" style="color:#ff3547; font-size:60px;"></i>`,
    confirmButtonText: "OK",
    buttonsStyling: false,
    customClass: {
      popup: "rounded-5 shadow-lg py-4 border-0",
      confirmButton: "btn btn-danger btn-danger2 swal-btn py-2 fw-semibold",
      closeButton: "position-absolute",
      icon: "border-0 mt-0",
      title: "p-0 m-0",
      actions: "p-0 m-0",
    },
    width: "350px",
    didRender: () => {
      const btn = document.querySelector(".swal2-confirm") as HTMLElement;
      if (btn) {
        btn.setAttribute(
          "style",
          `
            width: 250px;
            background-color: #ff3547;
            color: white;
            border-radius: 5px;
            padding: 10px 0;
            font-weight: 600;
            border: none;
            font-size: 15px;
            transition: background-color 0.3s ease, transform 0.2s ease;
          `
        );

        btn.addEventListener("mouseenter", () => {
          btn.style.backgroundColor = "#d82d3d";
          btn.style.transform = "scale(1.03)";
        });
        btn.addEventListener("mouseleave", () => {
          btn.style.backgroundColor = "#ff3547";
          btn.style.transform = "scale(1)";
        });
      }
    },
  });
};

export const showWarningAlert = (message: string) => {
  return Swal.fire({
    title: `<span class="fw-bold m-0 p-0">Warning</span>`,
    html: `
      <p class="text-muted  m-0 p-0 pb-3">
        ${message}
      </p>
    `,
    iconHtml: `<i class="bi bi-exclamation-circle-fill" style="color:#ffbb33; font-size:42px;"></i>`,
    confirmButtonText: "OK",
    buttonsStyling: false,
    customClass: {
      popup: "rounded-5 shadow-lg py-4 border-0",
      confirmButton: "btn btn-warning btn-warning2 swal-btn py-2 fw-semibold",
      closeButton: "position-absolute",
      icon: "border-0 mt-0",
      title: "p-0 m-0",
      actions: "p-0 m-0",
    },
    width: "350px",
    didRender: () => {
      const btn = document.querySelector(".swal2-confirm") as HTMLElement;
      if (btn) {
        btn.setAttribute(
          "style",
          `
            width: 250px;
            background-color: #ffbb33;
            color: white;
            border-radius: 5px;
            padding: 10px 0;
            font-weight: 600;
            border: none;
            font-size: 15px;
            transition: background-color 0.3s ease, transform 0.2s ease;
          `
        );

        btn.addEventListener("mouseenter", () => {
          btn.style.backgroundColor = "#e6a82e";
          btn.style.transform = "scale(1.03)";
        });
        btn.addEventListener("mouseleave", () => {
          btn.style.backgroundColor = "#ffbb33";
          btn.style.transform = "scale(1)";
        });
      }
    },
  });
};

export const showConfirmationAlert = async (title: string, message: string): Promise<boolean> => {
  const result = await Swal.fire({
    title: `<span class="fw-bold m-0 p-0">${title}</span>`,
    html: `
      <p class="text-muted  m-0 p-0 pb-3">
        ${message}
      </p>
    `,
    iconHtml: `<i class="bi bi-question-circle-fill" style="color:#17a2b8; font-size:42px;"></i>`,
    showCancelButton: true,
    confirmButtonText: "Yes, Continue",
    cancelButtonText: "Cancel",
    buttonsStyling: false,
    customClass: {
      popup: "rounded-5 shadow-lg py-4 border-0",
      confirmButton: "btn btn-primary btn-primary2 swal-btn py-2 fw-semibold me-2",
      cancelButton: "btn btn-secondary btn-secondary2 swal-btn py-2 fw-semibold",
      closeButton: "position-absolute",
      icon: "border-0 mt-0",
      title: "p-0 m-0",
      actions: "p-0 m-0",
    },
    width: "400px",
    didRender: () => {
      const confirmBtn = document.querySelector(".swal2-confirm") as HTMLElement;
      const cancelBtn = document.querySelector(".swal2-cancel") as HTMLElement;
      
      if (confirmBtn) {
        confirmBtn.setAttribute(
          "style",
          `
            width: 120px;
            background-color: #17a2b8;
            color: white;
            border-radius: 5px;
            padding: 10px 0;
            font-weight: 600;
            border: none;
            font-size: 14px;
            margin-right: 10px;
            transition: background-color 0.3s ease, transform 0.2s ease;
          `
        );

        confirmBtn.addEventListener("mouseenter", () => {
          confirmBtn.style.backgroundColor = "#138496";
          confirmBtn.style.transform = "scale(1.03)";
        });
        confirmBtn.addEventListener("mouseleave", () => {
          confirmBtn.style.backgroundColor = "#17a2b8";
          confirmBtn.style.transform = "scale(1)";
        });
      }

      if (cancelBtn) {
        cancelBtn.setAttribute(
          "style",
          `
            width: 120px;
            background-color: #6c757d;
            color: white;
            border-radius: 5px;
            padding: 10px 0;
            font-weight: 600;
            border: none;
            font-size: 14px;
            transition: background-color 0.3s ease, transform 0.2s ease;
          `
        );

        cancelBtn.addEventListener("mouseenter", () => {
          cancelBtn.style.backgroundColor = "#545b62";
          cancelBtn.style.transform = "scale(1.03)";
        });
        cancelBtn.addEventListener("mouseleave", () => {
          cancelBtn.style.backgroundColor = "#6c757d";
          cancelBtn.style.transform = "scale(1)";
        });
      }
    },
  });

  return result.isConfirmed;
};