import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { db } from "../../../Components/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import "./FilterPanelMobile.css";
import PostLocationMultiSelect from "../../../Components/FiltersMobile/PostLocationMultiSelect";

const FilterPanelMobile = ({
  show,
  onClose,
  searchQuery,
  setAllPosts,
  setFilteredPosts
}) => {
  const [allPostsLocal, setAllPostsLocal] = useState([]);

  // Filters
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [availableLocations, setAvailableLocations] = useState([]);

  const [dateFilter, setDateFilter] = useState("Show All");
  const [sortBy, setSortBy] = useState("Show All");
  const [sellerType, setSellerType] = useState("Show All");

  const [minYear, setMinYear] = useState("");
  const [maxYear, setMaxYear] = useState("");

  const [availableMakes, setAvailableMakes] = useState([]);
  const [selectedMakes, setSelectedMakes] = useState([]);

  const [availableModels, setAvailableModels] = useState([]);
  const [selectedModels, setSelectedModels] = useState([]);

  const [availableTrims, setAvailableTrims] = useState([]);
  const [selectedTrims, setSelectedTrims] = useState([]);

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [minOdometer, setMinOdometer] = useState("");
  const [maxOdometer, setMaxOdometer] = useState("");

  const [selectedTransmissions, setSelectedTransmissions] = useState([]);
  const [selectedFuel, setSelectedFuel] = useState([]);

  const [minCylinders, setMinCylinders] = useState("");
  const [maxCylinders, setMaxCylinders] = useState("");

  const [selectedDrive, setSelectedDrive] = useState([]);

  // Section toggle for accordion style
  const [sectionsOpen, setSectionsOpen] = useState({
    location: true,
    date: true,
    sort: true,
    sellerType: true,
    year: true,
    make: true,
    model: true,
    trim: true,
    price: true,
    odometer: true,
    transmission: true,
    fuel: true,
    cylinders: true,
    drive: true,
  });

  const toggleSection = (key) => {
    setSectionsOpen(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Fetch posts + unique filter values
  useEffect(() => {
    const fetchPosts = async () => {
      const ref = collection(db, "Posts");
      const q = query(ref, where("type", "==", "vehicle"));
      const snap = await getDocs(q);

      const posts = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setAllPostsLocal(posts);
      setAllPosts(posts);

      setAvailableLocations(Array.from(new Set(posts.map(p => p.location).filter(Boolean))));
      setAvailableTrims(Array.from(new Set(posts.map(p => p.trim).filter(t => t && t.trim() !== ""))));
      setAvailableMakes(Array.from(new Set(posts.map(p => p.make).filter(m => m && m.trim() !== ""))));
      setAvailableModels(Array.from(new Set(posts.map(p => p.model).filter(m => m && m.trim() !== ""))));
    };

    fetchPosts();
  }, [setAllPosts]);

  // Apply filters
  useEffect(() => {
    let filtered = [...allPostsLocal];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        (p.title || "").toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q)
      );
    }

    if (selectedLocations.length > 0)
      filtered = filtered.filter(p => selectedLocations.includes(p.location));

    if (sellerType !== "Show All")
      filtered = filtered.filter(p => p.sellerType === sellerType);

    if (minYear) filtered = filtered.filter(p => p.year >= Number(minYear));
    if (maxYear) filtered = filtered.filter(p => p.year <= Number(maxYear));

    if (selectedMakes.length > 0)
      filtered = filtered.filter(p => selectedMakes.includes(p.make));
    if (selectedModels.length > 0)
      filtered = filtered.filter(p => selectedModels.includes(p.model));
    if (selectedTrims.length > 0)
      filtered = filtered.filter(p => selectedTrims.includes(p.trim));

    if (minPrice !== '') {
      filtered = filtered.filter(p => p.price !== undefined && p.price >= Number(minPrice));
    }

    if (maxPrice !== '') {
      filtered = filtered.filter(p => p.price !== undefined && p.price <= Number(maxPrice));
    }

    if (selectedFuel.length > 0)
      filtered = filtered.filter(p => selectedFuel.includes(p.fuel));
    if (selectedTransmissions.length > 0)
      filtered = filtered.filter(p => selectedTransmissions.includes(p.transmission));

    if (minOdometer) filtered = filtered.filter(p => p.odometer >= Number(minOdometer));
    if (maxOdometer) filtered = filtered.filter(p => p.odometer <= Number(maxOdometer));

    if (minCylinders) filtered = filtered.filter(p => p.cylinders >= Number(minCylinders));
    if (maxCylinders) filtered = filtered.filter(p => p.cylinders <= Number(maxCylinders));

    if (selectedDrive.length > 0)
      filtered = filtered.filter(p => selectedDrive.includes(p.drive));

    // Date filter
    if (dateFilter !== "Show All") {
      const now = new Date();
      filtered = filtered.filter(p => {
        const postDate = new Date(p.createdAt?.seconds * 1000);
        if (dateFilter === "Today") return postDate.toDateString() === now.toDateString();
        if (dateFilter === "This Week") return now - postDate <= 7 * 86400000;
        if (dateFilter === "This Month") return postDate.getMonth() === now.getMonth() && postDate.getFullYear() === now.getFullYear();
        if (dateFilter === "Last Three Months") {
          const threeMonthsAgo = new Date();
          threeMonthsAgo.setMonth(now.getMonth() - 3);
          return postDate >= threeMonthsAgo && postDate <= now;
        }
        return true;
      });
    }

    // Sorting
    if (sortBy === "Newest") filtered.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
    if (sortBy === "Oldest") filtered.sort((a, b) => a.createdAt?.seconds - b.createdAt?.seconds);
    if (sortBy === "Most Liked") filtered.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));

    setFilteredPosts(filtered);
  }, [
    searchQuery,
    selectedLocations,
    dateFilter,
    sortBy,
    minPrice,
    maxPrice,
    minYear,
    maxYear,
    selectedMakes,
    selectedModels,
    selectedTrims,
    allPostsLocal,
    sellerType,
    minOdometer,
    maxOdometer,
    selectedTransmissions,
    selectedFuel,
    minCylinders,
    maxCylinders,
    selectedDrive
  ]);

  if (!show) return null;

  return (
    <div className="v-filter-overlay">
      <div className="v-filter-sheet">
        <div className="v-filter-sheet-header">
          <h3>Filters</h3>
          <FaTimes onClick={onClose} />
        </div>

        <div className="v-filter-sheet-body">
          {/** LOCATION **/}
          <div className="v-filter-group">
            <label>Post Locations</label>
            <PostLocationMultiSelect
              options={availableLocations}
              selected={selectedLocations}
              onChange={setSelectedLocations}
            />
          </div>

          {/** DATE **/}
          <div className="v-filter-group">
            <label>Date Posted</label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option>Show All</option>
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
              <option>Last Three Months</option>
            </select>
          </div>

          {/** SELLER TYPE **/}
          <div className="v-filter-group">
            <label>Seller Type</label>
            {["Show All", "Owner", "Dealer"].map(opt => (
              <button
                key={opt}
                className={sellerType === opt ? "active" : ""}
                onClick={() => setSellerType(opt)}
              >
                {opt}
              </button>
            ))}
          </div>

          {/** MAKE **/}
          <div className="v-filter-group">
            <label>Make</label>
            {availableMakes.map(make => (
              <button
                key={make}
                className={selectedMakes.includes(make) ? "active" : ""}
                onClick={() =>
                  setSelectedMakes(prev =>
                    prev.includes(make)
                      ? prev.filter(m => m !== make)
                      : [...prev, make]
                  )
                }
              >
                {make}
              </button>
            ))}
          </div>

          {/** MODEL **/}
          <div className="v-filter-group">
            <label>Model</label>
            {availableModels.map(model => (
              <button
                key={model}
                className={selectedModels.includes(model) ? "active" : ""}
                onClick={() =>
                  setSelectedModels(prev =>
                    prev.includes(model)
                      ? prev.filter(m => m !== model)
                      : [...prev, model]
                  )
                }
              >
                {model}
              </button>
            ))}
          </div>

          {/** TRIM **/}
          <div className="v-filter-group">
            <label>Trim</label>
            {availableTrims.map(trim => (
              <button
                key={trim}
                className={selectedTrims.includes(trim) ? "active" : ""}
                onClick={() =>
                  setSelectedTrims(prev =>
                    prev.includes(trim)
                      ? prev.filter(t => t !== trim)
                      : [...prev, trim]
                  )
                }
              >
                {trim}
              </button>
            ))}
          </div>

          {/** PRICE **/}
          <div className="v-filter-group">
            <label>Price Range</label>
            <div className="v-price-inputs">
              <input type="number" placeholder="Min" value={minPrice} onChange={e => setMinPrice(e.target.value)} />
              <input type="number" placeholder="Max" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />
            </div>
          </div>

          {/** TRANSMISSION **/}
          <div className="v-filter-group">
            <label>Transmission</label>
            {["Automatic", "Manual", "Other"].map(opt => (
              <button
                key={opt}
                className={selectedTransmissions.includes(opt) ? "active" : ""}
                onClick={() =>
                  setSelectedTransmissions(prev =>
                    prev.includes(opt)
                      ? prev.filter(t => t !== opt)
                      : [...prev, opt]
                  )
                }
              >
                {opt}
              </button>
            ))}
          </div>

          {/** FUEL **/}
          <div className="v-filter-group">
            <label>Fuel</label>
            {["Gas", "Diesel", "Hybrid", "Electric", "Other"].map(opt => (
              <button
                key={opt}
                className={selectedFuel.includes(opt) ? "active" : ""}
                onClick={() =>
                  setSelectedFuel(prev =>
                    prev.includes(opt)
                      ? prev.filter(f => f !== opt)
                      : [...prev, opt]
                  )
                }
              >
                {opt}
              </button>
            ))}
          </div>

          {/** ODOMETER **/}
          <div className="v-filter-group">
            <label>Odometer</label>
            <div className="v-price-inputs">
              <input type="number" placeholder="Min" value={minOdometer} onChange={e => setMinOdometer(e.target.value)} />
              <input type="number" placeholder="Max" value={maxOdometer} onChange={e => setMaxOdometer(e.target.value)} />
            </div>
          </div>

          {/** CYLINDERS **/}
          <div className="v-filter-group">
            <label>Cylinders</label>
            <div className="v-price-inputs">
              <input type="number" placeholder="Min" value={minCylinders} onChange={e => setMinCylinders(e.target.value)} />
              <input type="number" placeholder="Max" value={maxCylinders} onChange={e => setMaxCylinders(e.target.value)} />
            </div>
          </div>

          {/** DRIVE **/}
          <div className="v-filter-group">
            <label>Drive</label>
            {["FWD", "RWD", "4WD"].map(opt => (
              <button
                key={opt}
                className={selectedDrive.includes(opt) ? "active" : ""}
                onClick={() =>
                  setSelectedDrive(prev =>
                    prev.includes(opt)
                      ? prev.filter(d => d !== opt)
                      : [...prev, opt]
                  )
                }
              >
                {opt}
              </button>
            ))}
          </div>

          {/** SORT **/}
          <div className="v-filter-group">
            <label>Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option>Show All</option>
              <option>Newest</option>
              <option>Oldest</option>
              <option>Most Liked</option>
            </select>
          </div>

          <button className="v-apply-btn" onClick={onClose}>Apply Filters</button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanelMobile;