import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaUser,
  FaMapMarkerAlt,
  FaEdit,
  FaTrash,
  FaPlus,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import { authService } from "../../services/auth";
// import { getAddresses, createAddress, updateAddress, deleteAddress } from '../../services/address';
import { addressService } from "../../services/address";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingAddress, setEditingAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({
    address_type: "shipping",
    phone_number: "",
    full_address: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
    is_default: false,
  });

  useEffect(() => {
    fetchUserData();
    fetchAddresses();
  }, []);

  const fetchUserData = async () => {
    try {
      const data = await authService.getCurrentUser();
      setUser(data);
    } catch (err) {
      setError("Failed to load user data");
      console.error(err);
    }
  };

  const fetchAddresses = async () => {
    try {
      const data = await addressService.getAddresses();
      setAddresses(data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load addresses");
      setLoading(false);
      console.error(err);
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (editingAddress) {
        await addressService.updateAddress(editingAddress.id, addressForm);
        setSuccess("Address updated successfully");
      } else {
        await addressService.createAddress(addressForm);
        setSuccess("Address created successfully");
      }

      fetchAddresses();
      resetAddressForm();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save address");
      console.error(err);
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?"))
      return;

    try {
      await addressService.deleteAddress(id);
      setSuccess("Address deleted successfully");
      fetchAddresses();
    } catch (err) {
      setError("Failed to delete address");
      console.error(err);
    }
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setAddressForm({
      address_type: address.address_type,
      phone_number: "",
      full_address: "",
      city: "",
      state: "",
      postal_code: "",
      country: "",
      is_default: false,
    });
    setShowAddressForm(true);
  };

  const resetAddressForm = () => {
    setAddressForm({
      address_type: "shipping",
      phone_number: "",
      full_address: "",
      city: "",
      state: "",
      postal_code: "",
      country: "",
      is_default: false,
    });
    setEditingAddress(null);
    setShowAddressForm(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const getAddressesByType = (type) => {
    return addresses.filter((addr) => addr.address_type === type);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Alert Messages */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg"
          >
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg"
          >
            {success}
          </motion.div>
        )}

        {/* User Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6 mb-8"
        >
          <div className="flex items-center mb-6">
            <FaUser className="text-3xl text-blue-600 mr-4" />
            <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
          </div>

          {user && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <p className="text-lg text-gray-900">
                  {user.first_name || "Not provided"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <p className="text-lg text-gray-900">
                  {user.last_name || "Not provided"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <p className="text-lg text-gray-900">{user.username}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <p className="text-lg text-gray-900">{user.email}</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Addresses Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <FaMapMarkerAlt className="text-3xl text-blue-600 mr-4" />
              <h2 className="text-2xl font-bold text-gray-800">Addresses</h2>
            </div>
            {!showAddressForm && (
              <button
                onClick={() => setShowAddressForm(true)}
                className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                <FaPlus className="mr-2" />
                Add Address
              </button>
            )}
          </div>

          {/* Address Form */}
          {showAddressForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-6 bg-gray-50 p-6 rounded-lg border border-gray-200"
            >
              <h3 className="text-xl font-semibold mb-4">
                {editingAddress ? "Edit Address" : "New Address"}
              </h3>
              <form onSubmit={handleAddressSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address Type
                    </label>
                    <select
                      name="address_type"
                      value={addressForm.address_type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="shipping">Shipping</option>
                      <option value="billing">Billing</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Street Address
                    </label>
                    <input
                      type="text"
                      name="full_address"
                      value={addressForm.full_address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={addressForm.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State/Province
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={addressForm.state}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      name="postal_code"
                      value={addressForm.postal_code}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={addressForm.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone number
                    </label>
                    <input
                      type="text"
                      name="phone_number"
                      value={addressForm.phone_number}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="is_default"
                        checked={addressForm.is_default}
                        onChange={handleInputChange}
                        className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Set as default address
                      </span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="submit"
                    className="flex items-center bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    <FaSave className="mr-2" />
                    {editingAddress ? "Update" : "Save"} Address
                  </button>
                  <button
                    type="button"
                    onClick={resetAddressForm}
                    className="flex items-center bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
                  >
                    <FaTimes className="mr-2" />
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Shipping Addresses */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Shipping Addresses
            </h3>
            {getAddressesByType("shipping").length === 0 ? (
              <p className="text-gray-500 italic">
                No shipping addresses added yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getAddressesByType("shipping").map((address) => (
                  <AddressCard
                    key={address.id}
                    address={address}
                    onEdit={handleEditAddress}
                    onDelete={handleDeleteAddress}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Billing Addresses */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Billing Addresses
            </h3>
            {getAddressesByType("billing").length === 0 ? (
              <p className="text-gray-500 italic">
                No billing addresses added yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getAddressesByType("billing").map((address) => (
                  <AddressCard
                    key={address.id}
                    address={address}
                    onEdit={handleEditAddress}
                    onDelete={handleDeleteAddress}
                  />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const AddressCard = ({ address, onEdit, onDelete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          {address.is_default && (
            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-2">
              Default
            </span>
          )}
          <p className="text-gray-800 font-medium">{address.street_address}</p>
          <h1 className="text-gray-600 text-sm">
            {address.full_address}
          </h1>
          <p className="text-gray-600 text-sm">
            {address.city}, {address.state} {address.postal_code}
          </p>
          <p className="text-gray-600 text-sm">{address.country}</p>
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => onEdit(address)}
          className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          <FaEdit className="mr-1" />
          Edit
        </button>
        <button
          onClick={() => onDelete(address.id)}
          className="flex items-center text-red-600 hover:text-red-700 text-sm font-medium"
        >
          <FaTrash className="mr-1" />
          Delete
        </button>
      </div>
    </motion.div>
  );
};

export default Profile;
