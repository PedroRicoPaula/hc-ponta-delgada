import { motion } from 'framer-motion';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from 'react';

const sectionRight = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 2.0 }
  }
};

export const ContactSection = () => {
  const [isMapDialogOpen, setIsMapDialogOpen] = useState(false);

  return (
    <>
      <motion.section
        id="contact"
        className="py-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionRight}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Contactos</h2>
          <div className="text-center">
            <p className="text-gray-700 mb-2">
              <span className="font-semibold">Email:</span>
              {" "}
              <a href="mailto:hoqueiclube.pdl@gmail.com" className="text-primary hover:underline">
                hoqueiclube.pdl@gmail.com
              </a>
            </p>
            <p className="text-gray-700 mb-2">
              <span className="font-semibold">Telefone:</span>
              {" "}
              <a href="tel:+351296382987" className="text-primary hover:underline">
                +351 296 382 987
              </a>
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Morada:</span>
              {" "}
              <button
                type="button"
                onClick={() => setIsMapDialogOpen(true)}
                className="text-primary hover:underline"
              >
                R. Vítor Câmara Bloco 1 R/C Drt, 9500-234 Ponta Delgada
              </button>
            </p>
            <img
              src="/lovable-uploads/PavilhaoSidonioSerpa.jpg"
              alt="Fachada do Pavilhão Sidónio Serpa, casa do Hóquei Clube Ponta Delgada"
              className="mx-auto mt-6 w-full max-w-3xl h-48 md:h-64 object-cover rounded-lg shadow"
              loading="lazy"
            />
          </div>
        </div>
      </motion.section>

      <Dialog open={isMapDialogOpen} onOpenChange={setIsMapDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Abrir no Google Maps</h3>
            <p className="text-sm text-gray-600">
              Vai sair do site do Hóquei Clube PDL e abrir a morada no Google Maps.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setIsMapDialogOpen(false)}>Cancelar</Button>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Rua+Vítor+Câmara+Bloco+1+R/C+Drt,+9500-234+Ponta+Delgada"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90"
                onClick={() => setIsMapDialogOpen(false)}
              >
                Continuar para Google Maps
              </a>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};