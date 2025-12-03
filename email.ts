
export const sendApprovalEmail = async (email: string, name: string) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // In a real application, you would use EmailJS or a backend API here.
  // Example with EmailJS:
  // emailjs.send('service_id', 'template_id', { to_email: email, to_name: name })
  
  console.log(`[EMAIL SERVICE] Sending approval email to ${email} for user ${name}`);
  // Removed alert() to allow the UI to handle the success toast notification
  return true;
};